using Backend.BusinessLayer.Interfaces;
using Hangfire;

namespace Backend.Jobs;

public static class HangfireJobRegistrar
{
    public static void RegisterJobs(IRecurringJobManager manager)
    {
        // Daily monitoring — every day at 3:00 AM UTC
        manager.AddOrUpdate<IScraperOrchestrator>(
            recurringJobId: "daily-monitoring",
            methodCall:     o => o.RunDailyMonitoringAsync(CancellationToken.None),
            cronExpression: "0 3 * * *",
            options: new RecurringJobOptions
            {
                TimeZone = TimeZoneInfo.Utc
            });

        // Weekly report — every Monday at 8:00 AM UTC
        // Runs for all users; the orchestrator iterates users internally
        manager.AddOrUpdate<IScraperOrchestrator>(
            recurringJobId: "weekly-report",
            methodCall:     o => o.RunWeeklyReportAsync(Guid.Empty, CancellationToken.None),
            cronExpression: "0 8 * * 1",
            options: new RecurringJobOptions
            {
                TimeZone = TimeZoneInfo.Utc
            });
    }
}
