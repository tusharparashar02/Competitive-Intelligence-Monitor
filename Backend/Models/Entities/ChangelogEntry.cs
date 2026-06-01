using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models.Entities;

public class ChangelogEntry
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid CompetitorId { get; set; }

    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? EntryUrl { get; set; }

    public DateTime PublishedAt { get; set; }
    public DateTime ScrapedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey(nameof(CompetitorId))]
    public Competitor Competitor { get; set; } = null!;
}
