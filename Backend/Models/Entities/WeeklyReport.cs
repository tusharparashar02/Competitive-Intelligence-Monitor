using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models.Entities;

public class WeeklyReport
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid UserId { get; set; }

    public string? Title { get; set; }

    [Column(TypeName = "nvarchar(max)")]
    public string? Content { get; set; }

    public DateTime WeekStart { get; set; }
    public DateTime WeekEnd { get; set; }

    public int CompetitorsCovered { get; set; }

    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey(nameof(UserId))]
    public User User { get; set; } = null!;
}
