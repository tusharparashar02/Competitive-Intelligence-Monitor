using Backend.BusinessLayer.Interfaces;
using Backend.Models.Entities;
using Backend.Models.Enums;
using Backend.RepositoryLayer.Interfaces;
using CodeHollow.FeedReader;

namespace Backend.BusinessLayer.Services;

public class RssScraperService : IRssScraperService
{
    private readonly IChangelogRepository _changelogRepository;
    private readonly IAlertRepository     _alertRepository;
    private readonly ILogger<RssScraperService> _logger;

    public RssScraperService(
        IChangelogRepository changelogRepository,
        IAlertRepository alertRepository,
        ILogger<RssScraperService> logger)
    {
        _changelogRepository = changelogRepository;
        _alertRepository     = alertRepository;
        _logger              = logger;
    }

    public async Task<int> ScrapeChangelogAsync(Competitor competitor, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(competitor.RssChangelogUrl))
            return 0;

        _logger.LogInformation("RSS scrape starting for {Competitor} ({Url})",
            competitor.Name, competitor.RssChangelogUrl);

        var feed = await FeedReader.ReadAsync(competitor.RssChangelogUrl, ct);

        var latestStored = await _changelogRepository.GetLatestEntryDateAsync(competitor.Id);

        var newEntries = feed.Items
            .Where(item => item.PublishingDate.HasValue &&
                           item.PublishingDate.Value.ToUniversalTime() > (latestStored ?? DateTime.MinValue))
            .Select(item => new ChangelogEntry
            {
                CompetitorId = competitor.Id,
                Title        = item.Title,
                Description  = item.Description,
                EntryUrl     = item.Link,
                PublishedAt  = item.PublishingDate!.Value.ToUniversalTime(),
                ScrapedAt    = DateTime.UtcNow
            })
            .ToList();

        foreach (var entry in newEntries)
        {
            ct.ThrowIfCancellationRequested();
            await _changelogRepository.AddAsync(entry);
        }

        if (newEntries.Count > 0)
        {
            await _alertRepository.AddAsync(new Alert
            {
                UserId         = competitor.UserId,
                CompetitorId   = competitor.Id,
                CompetitorName = competitor.Name,
                AlertType      = AlertType.NewChangelog,
                Severity       = Severity.Medium,
                Message        = $"{competitor.Name} published {newEntries.Count} new changelog entr{(newEntries.Count == 1 ? "y" : "ies")}.",
                CreatedAt      = DateTime.UtcNow
            });
        }

        _logger.LogInformation("RSS scrape complete for {Competitor}: {Count} new entries",
            competitor.Name, newEntries.Count);

        return newEntries.Count;
    }
}
