using Backend.Models.DTOs.Responses;

namespace Backend.BusinessLayer.Interfaces;

public interface IPageChangeService
{
    Task<ApiResponse<PaginatedResponse<PageChangeResponse>>> GetChangesAsync(
        Guid competitorId, Guid userId, int page, int pageSize);
}
