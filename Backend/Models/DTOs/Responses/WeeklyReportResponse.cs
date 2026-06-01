namespace Backend.Models.DTOs.Responses;

public class WeeklyReportResponse
{
    public Guid Id { get; set; }
    public string? Title { get; set; }
    public string? Content { get; set; }
    public DateTime WeekStart { get; set; }
    public DateTime WeekEnd { get; set; }
    public int CompetitorsCovered { get; set; }
    public DateTime GeneratedAt { get; set; }
}
