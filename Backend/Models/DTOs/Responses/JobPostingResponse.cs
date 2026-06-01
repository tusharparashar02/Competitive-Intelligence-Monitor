namespace Backend.Models.DTOs.Responses;

public class JobPostingResponse
{
    public Guid Id { get; set; }
    public Guid CompetitorId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Location { get; set; }
    public string? Department { get; set; }
    public string? JobUrl { get; set; }
    public DateTime? PostedAt { get; set; }
    public DateTime ScrapedAt { get; set; }
}
