using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Models.Enums;

namespace Backend.Models.Entities;

public class PageChange
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid CompetitorId { get; set; }

    public string? PageUrl { get; set; }
    public string? ChangeSummary { get; set; }

    public ChangeType ChangeType { get; set; } = ChangeType.Other;
    public Severity Severity { get; set; } = Severity.Low;

    public DateTime DetectedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey(nameof(CompetitorId))]
    public Competitor Competitor { get; set; } = null!;
}
