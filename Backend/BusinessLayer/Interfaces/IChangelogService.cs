using Backend.Models.DTOs.Responses;

namespace Backend.BusinessLayer.Interfaces;

public interface IChangelogService
{
    Task<ApiResponse<PaginatedResponse<ChangelogEntryResponse>>> GetEntriesAsync(
        Guid competitorId, Guid userId, int page, int pageSize);
}
