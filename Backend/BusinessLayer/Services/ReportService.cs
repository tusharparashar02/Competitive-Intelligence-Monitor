using AutoMapper;
using Backend.BusinessLayer.Interfaces;
using Backend.Models.DTOs.Responses;
using Backend.RepositoryLayer.Interfaces;

namespace Backend.BusinessLayer.Services;

public class ReportService : IReportService
{
    private readonly IReportRepository _reportRepository;
    private readonly IMapper           _mapper;

    public ReportService(IReportRepository reportRepository, IMapper mapper)
    {
        _reportRepository = reportRepository;
        _mapper           = mapper;
    }

    public async Task<ApiResponse<IEnumerable<WeeklyReportResponse>>> GetReportsAsync(Guid userId)
    {
        try
        {
            var reports = await _reportRepository.GetByUserIdAsync(userId);
            var mapped  = _mapper.Map<IEnumerable<WeeklyReportResponse>>(reports);
            return ApiResponse<IEnumerable<WeeklyReportResponse>>.Ok(mapped);
        }
        catch (Exception)
        {
            return ApiResponse<IEnumerable<WeeklyReportResponse>>.Fail("Failed to retrieve reports.");
        }
    }

    public async Task<ApiResponse<WeeklyReportResponse>> GetReportByIdAsync(Guid reportId, Guid userId)
    {
        try
        {
            var report = await _reportRepository.GetByIdAsync(reportId);

            if (report is null || report.UserId != userId)
                return ApiResponse<WeeklyReportResponse>.Fail("Report not found.");

            var mapped = _mapper.Map<WeeklyReportResponse>(report);
            return ApiResponse<WeeklyReportResponse>.Ok(mapped);
        }
        catch (Exception)
        {
            return ApiResponse<WeeklyReportResponse>.Fail("Failed to retrieve report.");
        }
    }
}
