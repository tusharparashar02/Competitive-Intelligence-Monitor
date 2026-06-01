using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models.Entities;

public class RedditMention
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid CompetitorId { get; set; }

    public string? PostTitle { get; set; }
    public string? Subreddit { get; set; }
    public string? PostUrl { get; set; }

    /// <summary>Sentiment score in range -1.0 (negative) to 1.0 (positive).</summary>
    [Range(-1.0, 1.0)]
    public double SentimentScore { get; set; }

    public int Upvotes { get; set; }

    public DateTime PostedAt { get; set; }
    public DateTime ScrapedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey(nameof(CompetitorId))]
    public Competitor Competitor { get; set; } = null!;
}
