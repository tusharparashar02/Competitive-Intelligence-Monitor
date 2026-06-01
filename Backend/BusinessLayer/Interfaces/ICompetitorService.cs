using Backend.Models.DTOs.Requests;
using Backend.Models.DTOs.Responses;

namespace Backend.BusinessLayer.Interfaces;

public interface ICompetitorService
{
    Task<ApiResponse<CompetitorResponse>> CreateAsync(CreateCompetitorRequest request, Guid userId);
    Task<ApiResponse<IEnumerable<CompetitorResponse>>> GetAllAsync(Guid userId);
    Task<ApiResponse<CompetitorResponse>> GetByIdAsync(Guid id, Guid userId);
    Task<ApiResponse<CompetitorResponse>> UpdateAsync(Guid id, UpdateCompetitorRequest request, Guid userId);
    Task<ApiResponse<bool>> DeleteAsync(Guid id, Guid userId);
}
