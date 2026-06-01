using AutoMapper;
using Backend.BusinessLayer.Interfaces;
using Backend.Hubs;
using Backend.Models.DTOs.Responses;
using Backend.Models.Entities;
using Backend.RepositoryLayer.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace Backend.BusinessLayer.Services;

public class ScraperOrchestratorService : IScraperOrchestrator
{
    private readonly ICompetitorRepository  _competitorRepository;
    private readonly IAlertRepository       _alertRepository;
    private readonly IUserRepository        _userRepository;
    private readonly IRssScraperService     _rssScraper;
    private readonly IJobScraperService     _jobScraper;
    private readonly IRedditScraperService  _redditScraper;
    private readonly IPageSnapshotService   _snapshotService;
    private readonly IHubContext<NotificationHub> _hub;
    private readonly IMapper                _mapper;
    private readonly ILogger<ScraperOrchestratorService> _logger;

    public ScraperOrchestratorService(
        ICompetitorRepository competitorRepository,
        IAlertRepository alertRepository,
        IUserRepository userRepository,
        IRssScraperService rssScraper,
        IJobScraperService jobScraper,
        IRedditScraperService redditScraper,
        IPageSnapshotService snapshotService,
        IHubContext<NotificationHub> hub,
        IMapper mapper,
        ILogger<ScraperOrchestratorService> logger)
    {
        _competitorRepository = competitorRepository;
        _alertRepository      = alertRepository;
        _userRepository       = userRepository;
        _rssScraper           = rssScraper;
        _jobScraper           = jobScraper;
        _redditScraper        = redditScraper;
        _snapshotService      = snapshotService;
        _hub                  = hub;
        _mapper               = mapper;
        _logger               = logger;
    }

    public async Task RunDailyMonitoringAsync(CancellationToken ct = default)
    {
        _logger.LogInformation("Daily monitoring run started at {Time}", DateTime.UtcNow);

        var competitors = await _competitorRepository.GetActiveCompetitorsAsync();

        foreach (var competitor in competitors)
        {
            ct.ThrowIfCancellationRequested();
            await RunCompetitorJobAsync(competitor.Id, ct);
        }

        _logger.LogInformation("Daily monitoring run completed at {Time}", DateTime.UtcNow);
    }

    public async Task RunCompetitorJobAsync(Guid competitorId, CancellationToken ct = default)
    {
        var competitor = await _competitorRepository.GetByIdAsync(competitorId);
        if (competitor is null)
        {
            _logger.LogWarning("Competitor {Id} not found, skipping", competitorId);
            return;
        }

        _logger.LogInformation("Processing competitor: {Name} ({Id})", competitor.Name, competitor.Id);

        var alertsBefore = (await _alertRepository.GetByUserIdAsync(competitor.UserId)).Count();

        try { await _jobScraper.ScrapeJobPostingsAsync(competitor, ct); }
        catch (Exception ex) { _logger.LogError(ex, "Job scraper failed for {Name}", competitor.Name); }

        try { await _rssScraper.ScrapeChangelogAsync(competitor, ct); }
        catch (Exception ex) { _logger.LogError(ex, "RSS scraper failed for {Name}", competitor.Name); }

        try { await _redditScraper.ScrapeRedditAsync(competitor, ct); }
        catch (Exception ex) { _logger.LogError(ex, "Reddit scraper failed for {Name}", competitor.Name); }

        try { await _snapshotService.TakePageSnapshotAsync(competitor, ct); }
        catch (Exception ex) { _logger.LogError(ex, "Page snapshot failed for {Name}", competitor.Name); }

        // Update LastMonitoredAt
        competitor.LastMonitoredAt = DateTime.UtcNow;
        await _competitorRepository.UpdateAsync(competitor);

        // Push any new alerts to the user via SignalR
        var alertsAfter = await _alertRepository.GetByUserIdAsync(competitor.UserId);
        var newAlerts   = alertsAfter.Skip(alertsBefore).ToList();

        foreach (var alert in newAlerts)
        {
            var dto = _mapper.Map<AlertResponse>(alert);
            await _hub.Clients
                      .Group(competitor.UserId.ToString())
                      .SendAsync("ReceiveAlert", dto);
        }

        _logger.LogInformation("Competitor {Name} processed. {Count} new alert(s) pushed.",
            competitor.Name, newAlerts.Count);
    }

    public async Task RunWeeklyReportAsync(Guid userId, CancellationToken ct = default)
    {
        _logger.LogInformation("Weekly report job started for user {UserId}", userId);

        var user = await _userRepository.GetByIdAsync(userId);
        if (user is null)
        {
            _logger.LogWarning("User {UserId} not found, skipping weekly report", userId);
            return;
        }

        // Placeholder — report generation service will be wired here
        _logger.LogInformation("Weekly report job completed for user {UserId}", userId);
    }
}
