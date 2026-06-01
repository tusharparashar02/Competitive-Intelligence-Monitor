using Backend.Models.DTOs.Responses;

namespace Backend.BusinessLayer.Interfaces;

public interface IReportService
{
    Task<ApiResponse<IEnumerable<WeeklyReportResponse>>> GetReportsAsync(Guid userId);
    Task<ApiResponse<WeeklyReportResponse>> GetReportByIdAsync(Guid reportId, Guid userId);
}
