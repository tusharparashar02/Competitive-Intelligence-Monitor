using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models.Entities;

public class JobPosting
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid CompetitorId { get; set; }

    [Required]
    public string Title { get; set; } = string.Empty;

    public string? Location { get; set; }
    public string? Department { get; set; }
    public string? JobUrl { get; set; }

    public DateTime? PostedAt { get; set; }
    public DateTime ScrapedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey(nameof(CompetitorId))]
    public Competitor Competitor { get; set; } = null!;
}
