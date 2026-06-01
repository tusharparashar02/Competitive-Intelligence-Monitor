using System.ComponentModel.DataAnnotations;
using Backend.Models.Enums;

namespace Backend.Models.DTOs.Requests;

public class CreateCompetitorRequest
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [Url]
    public string WebsiteUrl { get; set; } = string.Empty;

    public string? LinkedInUrl { get; set; }
    public string? IndeedSearchTerm { get; set; }
    public string? RssChangelogUrl { get; set; }
    public string? RedditSearchTerm { get; set; }

    public MonitoringFrequency MonitoringFrequency { get; set; } = MonitoringFrequency.Daily;

    public string? Notes { get; set; }
}
