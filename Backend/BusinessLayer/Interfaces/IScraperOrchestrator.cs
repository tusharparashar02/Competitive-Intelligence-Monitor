namespace Backend.BusinessLayer.Interfaces;

public interface IScraperOrchestrator
{
    Task RunDailyMonitoringAsync(CancellationToken ct = default);
    Task RunCompetitorJobAsync(Guid competitorId, CancellationToken ct = default);
    Task RunWeeklyReportAsync(Guid userId, CancellationToken ct = default);
}
