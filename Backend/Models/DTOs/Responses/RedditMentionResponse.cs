namespace Backend.Models.DTOs.Responses;

public class RedditMentionResponse
{
    public Guid Id { get; set; }
    public Guid CompetitorId { get; set; }
    public string? PostTitle { get; set; }
    public string? Subreddit { get; set; }
    public string? PostUrl { get; set; }
    public double SentimentScore { get; set; }
    public int Upvotes { get; set; }
    public DateTime PostedAt { get; set; }
}
