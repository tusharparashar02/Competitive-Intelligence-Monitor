using System.Security.Cryptography;
using System.Text;
using Backend.BusinessLayer.Interfaces;
using Backend.Models.Entities;
using Backend.Models.Enums;
using Backend.RepositoryLayer.Interfaces;

namespace Backend.BusinessLayer.Services;

public class PageSnapshotService : IPageSnapshotService
{
    private readonly IPageChangeRepository _pageChangeRepository;
    private readonly IAlertRepository      _alertRepository;
    private readonly IHttpClientFactory    _httpClientFactory;
    private readonly ILogger<PageSnapshotService> _logger;

    public PageSnapshotService(
        IPageChangeRepository pageChangeRepository,
        IAlertRepository alertRepository,
        IHttpClientFactory httpClientFactory,
        ILogger<PageSnapshotService> logger)
    {
        _pageChangeRepository = pageChangeRepository;
        _alertRepository      = alertRepository;
        _httpClientFactory    = httpClientFactory;
        _logger               = logger;
    }

    public async Task TakePageSnapshotAsync(Competitor competitor, CancellationToken ct = default)
    {
        _logger.LogInformation("Page snapshot starting for {Competitor} ({Url})",
            competitor.Name, competitor.WebsiteUrl);

        var client = _httpClientFactory.CreateClient("scraper");
        client.DefaultRequestHeaders.UserAgent.ParseAdd(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36");

        string html;
        try
        {
            html = await client.GetStringAsync(competitor.WebsiteUrl, ct);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to fetch page for {Competitor}", competitor.Name);
            return;
        }

        var currentHash = ComputeHash(html);
        var previous    = await _pageChangeRepository.GetLatestSnapshotAsync(competitor.Id, competitor.WebsiteUrl);

        // Save new snapshot
        await _pageChangeRepository.SaveSnapshotAsync(new PageSnapshot
        {
            CompetitorId  = competitor.Id,
            PageUrl       = competitor.WebsiteUrl,
            ContentHash   = currentHash,
            RawContent    = html,
            SnapshotDate  = DateTime.UtcNow
        });

        if (previous is not null && previous.ContentHash != currentHash)
        {
            var change = new PageChange
            {
                CompetitorId  = competitor.Id,
                PageUrl       = competitor.WebsiteUrl,
                ChangeSummary = $"Content changed on {competitor.WebsiteUrl}",
                ChangeType    = ChangeType.ContentUpdate,
                Severity      = Severity.Medium,
                DetectedAt    = DateTime.UtcNow
            };

            await _pageChangeRepository.AddAsync(change);

            await _alertRepository.AddAsync(new Alert
            {
                UserId         = competitor.UserId,
                CompetitorId   = competitor.Id,
                CompetitorName = competitor.Name,
                AlertType      = AlertType.PageChange,
                Severity       = Severity.Medium,
                Message        = $"{competitor.Name}'s website content changed.",
                CreatedAt      = DateTime.UtcNow
            });

            _logger.LogInformation("Page change detected for {Competitor}", competitor.Name);
        }
    }

    private static string ComputeHash(string content)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(content));
        return Convert.ToHexString(bytes);
    }
}
