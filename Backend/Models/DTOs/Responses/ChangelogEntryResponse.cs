namespace Backend.Models.DTOs.Responses;

public class ChangelogEntryResponse
{
    public Guid Id { get; set; }
    public Guid CompetitorId { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? EntryUrl { get; set; }
    public DateTime PublishedAt { get; set; }
}
