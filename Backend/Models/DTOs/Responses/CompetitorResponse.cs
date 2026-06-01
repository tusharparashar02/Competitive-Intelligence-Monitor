namespace Backend.Models.DTOs.Responses;

public class CompetitorResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string WebsiteUrl { get; set; } = string.Empty;
    public string? LinkedInUrl { get; set; }
    public string? IndeedSearchTerm { get; set; }
    public string? RssChangelogUrl { get; set; }
    public string? RedditSearchTerm { get; set; }
    public string MonitoringFrequency { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public bool IsActive { get; set; }
    public DateTime? LastMonitoredAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public int TotalAlerts { get; set; }
}
