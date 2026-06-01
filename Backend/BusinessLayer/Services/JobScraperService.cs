using System.Text.RegularExpressions;
using System.Web;
using Backend.BusinessLayer.Interfaces;
using Backend.Models.Entities;
using Backend.Models.Enums;
using Backend.RepositoryLayer.Interfaces;

namespace Backend.BusinessLayer.Services;

public class JobScraperService : IJobScraperService
{
    private readonly IJobPostingRepository _jobRepository;
    private readonly IAlertRepository      _alertRepository;
    private readonly IHttpClientFactory    _httpClientFactory;
    private readonly ILogger<JobScraperService> _logger;

    private static readonly string[] _userAgents =
    [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    ];

    public JobScraperService(
        IJobPostingRepository jobRepository,
        IAlertRepository alertRepository,
        IHttpClientFactory httpClientFactory,
        ILogger<JobScraperService> logger)
    {
        _jobRepository     = jobRepository;
        _alertRepository   = alertRepository;
        _httpClientFactory = httpClientFactory;
        _logger            = logger;
    }

    public async Task<int> ScrapeJobPostingsAsync(Competitor competitor, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(competitor.IndeedSearchTerm))
            return 0;

        _logger.LogInformation("Job scrape starting for {Competitor} (term: {Term})",
            competitor.Name, competitor.IndeedSearchTerm);

        var encodedTerm = HttpUtility.UrlEncode(competitor.IndeedSearchTerm);
        var url         = $"https://www.indeed.com/jobs?q={encodedTerm}&sort=date";

        var client = _httpClientFactory.CreateClient("scraper");
        client.DefaultRequestHeaders.UserAgent.ParseAdd(
            _userAgents[Random.Shared.Next(_userAgents.Length)]);

        string html;
        try
        {
            html = await client.GetStringAsync(url, ct);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to fetch Indeed page for {Competitor}", competitor.Name);
            return 0;
        }

        var jobs    = ParseJobListings(html);
        var saved   = 0;

        foreach (var job in jobs)
        {
            ct.ThrowIfCancellationRequested();

            var exists = await _jobRepository.JobExistsAsync(competitor.Id, job.Title, job.Location);
            if (exists) continue;

            await _jobRepository.AddAsync(new JobPosting
            {
                CompetitorId = competitor.Id,
                Title        = job.Title,
                Location     = job.Location,
                JobUrl       = job.Url,
                PostedAt     = job.PostedAt,
                ScrapedAt    = DateTime.UtcNow
            });

            saved++;
        }

        if (saved >= 5)
        {
            await _alertRepository.AddAsync(new Alert
            {
                UserId         = competitor.UserId,
                CompetitorId   = competitor.Id,
                CompetitorName = competitor.Name,
                AlertType      = AlertType.NewJobPostings,
                Severity       = Severity.High,
                Message        = $"{competitor.Name} posted {saved} new job listings — possible hiring surge.",
                CreatedAt      = DateTime.UtcNow
            });
        }

        await Task.Delay(TimeSpan.FromSeconds(2), ct);

        _logger.LogInformation("Job scrape complete for {Competitor}: {Count} new postings saved",
            competitor.Name, saved);

        return saved;
    }

    // ── HTML parsing ──────────────────────────────────────────────────────────

    private static List<(string Title, string? Location, string? Url, DateTime? PostedAt)> ParseJobListings(string html)
    {
        var results = new List<(string, string?, string?, DateTime?)>();

        // Match job card title anchors: <a ... data-jk="..." ...><span ...>Title</span></a>
        var titleMatches = Regex.Matches(html,
            @"data-jk=""([^""]+)""[^>]*>.*?<span[^>]*title=""([^""]+)""",
            RegexOptions.Singleline);

        foreach (Match m in titleMatches)
        {
            var jobKey = m.Groups[1].Value;
            var title  = HttpUtility.HtmlDecode(m.Groups[2].Value).Trim();

            // Extract location near this job key occurrence
            var locationMatch = Regex.Match(html,
                $@"data-jk=""{Regex.Escape(jobKey)}"".*?<div[^>]*data-testid=""text-location""[^>]*>([^<]+)<",
                RegexOptions.Singleline);

            var location = locationMatch.Success
                ? HttpUtility.HtmlDecode(locationMatch.Groups[1].Value).Trim()
                : null;

            var jobUrl = $"https://www.indeed.com/viewjob?jk={jobKey}";

            results.Add((title, location, jobUrl, null));

            if (results.Count >= 25) break;
        }

        return results;
    }
}
