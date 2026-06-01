using Backend.Models.Enums;

namespace Backend.Models.DTOs;

public class CreateCompetitorDto
{
    public string Name { get; set; } = string.Empty;
    public string WebsiteUrl { get; set; } = string.Empty;
    public string? LinkedInUrl { get; set; }
    public string? IndeedSearchTerm { get; set; }
    public string? G2ProfileUrl { get; set; }
    public MonitoringFrequency Frequency { get; set; }
    public string? Notes { get; set; }
}

public class CompetitorResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string WebsiteUrl { get; set; } = string.Empty;
    public string? LinkedInUrl { get; set; }
    public string? IndeedSearchTerm { get; set; }
    public string? G2ProfileUrl { get; set; }
    public string Frequency { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public DateTime? LastMonitoredAt { get; set; }
    public DateTime CreatedAt { get; set; }
}
