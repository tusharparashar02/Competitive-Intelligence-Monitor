namespace Backend.Models.DTOs.Responses;

public class AlertResponse
{
    public Guid Id { get; set; }
    public string? CompetitorName { get; set; }
    public string AlertType { get; set; } = string.Empty;
    public string? Message { get; set; }
    public string Severity { get; set; } = string.Empty;
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }
}
