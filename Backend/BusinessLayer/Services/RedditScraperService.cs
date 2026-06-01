using System.Text.Json;
using System.Web;
using Backend.BusinessLayer.Interfaces;
using Backend.Models.Entities;
using Backend.Models.Enums;
using Backend.RepositoryLayer.Interfaces;

namespace Backend.BusinessLayer.Services;

public class RedditScraperService : IRedditScraperService
{
    private readonly IRedditMentionRepository _redditRepository;
    private readonly IAlertRepository         _alertRepository;
    private readonly IHttpClientFactory       _httpClientFactory;
    private readonly IConfiguration           _config;
    private readonly ILogger<RedditScraperService> _logger;

    private static readonly string[] _positiveKeywords = ["great", "love", "amazing", "best", "awesome", "excellent", "perfect", "fantastic"];
    private static readonly string[] _negativeKeywords = ["bad", "slow", "broken", "worst", "hate", "terrible", "awful", "buggy", "crash"];

    public RedditScraperService(
        IRedditMentionRepository redditRepository,
        IAlertRepository alertRepository,
        IHttpClientFactory httpClientFactory,
        IConfiguration config,
        ILogger<RedditScraperService> logger)
    {
        _redditRepository  = redditRepository;
        _alertRepository   = alertRepository;
        _httpClientFactory = httpClientFactory;
        _config            = config;
        _logger            = logger;
    }

    public async Task<int> ScrapeRedditAsync(Competitor competitor, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(competitor.RedditSearchTerm))
            return 0;

        _logger.LogInformation("Reddit scrape starting for {Competitor} (term: {Term})",
            competitor.Name, competitor.RedditSearchTerm);

        var userAgent = _config["RedditApi:UserAgent"] ?? "CompetitiveIntelligenceMonitor/1.0";
        var encoded   = HttpUtility.UrlEncode(competitor.RedditSearchTerm);
        var url       = $"https://www.reddit.com/search.json?q={encoded}&sort=new&limit=25";

        var client = _httpClientFactory.CreateClient("scraper");
        client.DefaultRequestHeaders.UserAgent.ParseAdd(userAgent);

        string json;
        try
        {
            json = await client.GetStringAsync(url, ct);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to fetch Reddit data for {Competitor}", competitor.Name);
            return 0;
        }

        var posts  = ParseRedditPosts(json);
        var saved  = 0;
        var scores = new List<double>();

        foreach (var post in posts)
        {
            ct.ThrowIfCancellationRequested();

            // Deduplicate by URL
            var existing = await _redditRepository.GetByCompetitorIdAsync(competitor.Id, 1, 1000);
            if (existing.Any(r => r.PostUrl == post.Url)) continue;

            var sentiment = CalculateSentiment(post.Title);
            scores.Add(sentiment);

            await _redditRepository.AddAsync(new RedditMention
            {
                CompetitorId   = competitor.Id,
                PostTitle      = post.Title,
                Subreddit      = post.Subreddit,
                PostUrl        = post.Url,
                SentimentScore = sentiment,
                Upvotes        = post.Score,
                PostedAt       = DateTimeOffset.FromUnixTimeSeconds(post.CreatedUtc).UtcDateTime,
                ScrapedAt      = DateTime.UtcNow
            });

            saved++;
        }

        if (scores.Count > 0)
        {
            var avgSentiment = scores.Average();
            if (avgSentiment < -0.3)
            {
                await _alertRepository.AddAsync(new Alert
                {
                    UserId         = competitor.UserId,
                    CompetitorId   = competitor.Id,
                    CompetitorName = competitor.Name,
                    AlertType      = AlertType.SentimentShift,
                    Severity       = Severity.High,
                    Message        = $"{competitor.Name} Reddit sentiment dropped to {avgSentiment:F2} — negative community reaction detected.",
                    CreatedAt      = DateTime.UtcNow
                });
            }
        }

        _logger.LogInformation("Reddit scrape complete for {Competitor}: {Count} new mentions saved",
            competitor.Name, saved);

        return saved;
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private static double CalculateSentiment(string? text)
    {
        if (string.IsNullOrWhiteSpace(text)) return 0;

        var lower = text.ToLowerInvariant();
        var score = 0.0;

        foreach (var kw in _positiveKeywords)
            if (lower.Contains(kw)) score += 0.1;

        foreach (var kw in _negativeKeywords)
            if (lower.Contains(kw)) score -= 0.1;

        return Math.Clamp(score, -1.0, 1.0);
    }

    private static List<(string Title, string Subreddit, string Url, int Score, long CreatedUtc)> ParseRedditPosts(string json)
    {
        var results = new List<(string, string, string, int, long)>();

        try
        {
            using var doc      = JsonDocument.Parse(json);
            var children       = doc.RootElement
                                    .GetProperty("data")
                                    .GetProperty("children");

            foreach (var child in children.EnumerateArray())
            {
                var data       = child.GetProperty("data");
                var title      = data.GetProperty("title").GetString() ?? string.Empty;
                var subreddit  = data.GetProperty("subreddit").GetString() ?? string.Empty;
                var permalink  = data.GetProperty("permalink").GetString() ?? string.Empty;
                var score      = data.GetProperty("score").GetInt32();
                var created    = (long)data.GetProperty("created_utc").GetDouble();

                results.Add((title, subreddit, $"https://reddit.com{permalink}", score, created));
            }
        }
        catch (Exception)
        {
            // Malformed JSON — return empty list, caller handles gracefully
        }

        return results;
    }
}
