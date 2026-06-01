using AutoMapper;
using Backend.BusinessLayer.Interfaces;
using Backend.Models.DTOs.Responses;
using Backend.RepositoryLayer.Interfaces;

namespace Backend.BusinessLayer.Services;

public class JobService : IJobService
{
    private readonly IJobPostingRepository  _jobRepository;
    private readonly ICompetitorRepository  _competitorRepository;
    private readonly IMapper                _mapper;

    public JobService(
        IJobPostingRepository jobRepository,
        ICompetitorRepository competitorRepository,
        IMapper mapper)
    {
        _jobRepository        = jobRepository;
        _competitorRepository = competitorRepository;
        _mapper               = mapper;
    }

    public async Task<ApiResponse<PaginatedResponse<JobPostingResponse>>> GetJobsAsync(
        Guid competitorId, Guid userId, int page, int pageSize)
    {
        try
        {
            var competitor = await _competitorRepository.GetByIdAsync(competitorId);
            if (competitor is null || competitor.UserId != userId)
                return ApiResponse<PaginatedResponse<JobPostingResponse>>.Fail("Competitor not found.");

            var items      = await _jobRepository.GetByCompetitorIdAsync(competitorId, page, pageSize);
            var totalCount = await _jobRepository.GetCountByCompetitorIdAsync(competitorId);
            var mapped     = _mapper.Map<List<JobPostingResponse>>(items);

            var paginated = PaginatedResponse<JobPostingResponse>.Create(mapped, totalCount, page, pageSize);
            return ApiResponse<PaginatedResponse<JobPostingResponse>>.Ok(paginated);
        }
        catch (Exception)
        {
            return ApiResponse<PaginatedResponse<JobPostingResponse>>.Fail("Failed to retrieve job postings.");
        }
    }
}
