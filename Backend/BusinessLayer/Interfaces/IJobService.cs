using Backend.Models.DTOs.Responses;

namespace Backend.BusinessLayer.Interfaces;

public interface IJobService
{
    Task<ApiResponse<PaginatedResponse<JobPostingResponse>>> GetJobsAsync(
        Guid competitorId, Guid userId, int page, int pageSize);
}
