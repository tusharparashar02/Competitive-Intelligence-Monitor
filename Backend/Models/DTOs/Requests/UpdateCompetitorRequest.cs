using Backend.Models.Enums;

namespace Backend.Models.DTOs.Requests;

public class UpdateCompetitorRequest
{
    public string? Name { get; set; }
    public string? WebsiteUrl { get; set; }
    public string? LinkedInUrl { get; set; }
    public string? IndeedSearchTerm { get; set; }
    public string? RssChangelogUrl { get; set; }
    public string? RedditSearchTerm { get; set; }
    public MonitoringFrequency? MonitoringFrequency { get; set; }
    public string? Notes { get; set; }
    public bool? IsActive { get; set; }
}
