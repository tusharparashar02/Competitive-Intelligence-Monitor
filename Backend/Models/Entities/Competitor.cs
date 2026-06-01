using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Models.Enums;

namespace Backend.Models.Entities;

public class Competitor
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid UserId { get; set; }

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string WebsiteUrl { get; set; } = string.Empty;

    public string? LinkedInUrl { get; set; }
    public string? IndeedSearchTerm { get; set; }
    public string? RssChangelogUrl { get; set; }
    public string? RedditSearchTerm { get; set; }

    public MonitoringFrequency MonitoringFrequency { get; set; } = MonitoringFrequency.Daily;

    public string? Notes { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime? LastMonitoredAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey(nameof(UserId))]
    public User User { get; set; } = null!;

    public ICollection<JobPosting> JobPostings { get; set; } = [];
    public ICollection<PageChange> PageChanges { get; set; } = [];
    public ICollection<RedditMention> RedditMentions { get; set; } = [];
    public ICollection<ChangelogEntry> ChangelogEntries { get; set; } = [];
}
