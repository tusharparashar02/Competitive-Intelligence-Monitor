using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models.Entities;

public class PageSnapshot
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid CompetitorId { get; set; }

    [Required]
    public string PageUrl { get; set; } = string.Empty;

    public string? ContentHash { get; set; }

    [Column(TypeName = "nvarchar(max)")]
    public string? RawContent { get; set; }

    public DateTime SnapshotDate { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey(nameof(CompetitorId))]
    public Competitor Competitor { get; set; } = null!;
}
