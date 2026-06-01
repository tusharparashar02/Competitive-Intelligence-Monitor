namespace Backend.Models.DTOs.Responses;

public class PageChangeResponse
{
    public Guid Id { get; set; }
    public Guid CompetitorId { get; set; }
    public string? PageUrl { get; set; }
    public string? ChangeSummary { get; set; }
    public string ChangeType { get; set; } = string.Empty;
    public string Severity { get; set; } = string.Empty;
    public DateTime DetectedAt { get; set; }
}
