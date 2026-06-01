using AutoMapper;
using Backend.BusinessLayer.Interfaces;
using Backend.Models.DTOs.Responses;
using Backend.RepositoryLayer.Interfaces;

namespace Backend.BusinessLayer.Services;

public class ChangelogService : IChangelogService
{
    private readonly IChangelogRepository  _changelogRepository;
    private readonly ICompetitorRepository _competitorRepository;
    private readonly IMapper               _mapper;

    public ChangelogService(
        IChangelogRepository changelogRepository,
        ICompetitorRepository competitorRepository,
        IMapper mapper)
    {
        _changelogRepository  = changelogRepository;
        _competitorRepository = competitorRepository;
        _mapper               = mapper;
    }

    public async Task<ApiResponse<PaginatedResponse<ChangelogEntryResponse>>> GetEntriesAsync(
        Guid competitorId, Guid userId, int page, int pageSize)
    {
        try
        {
            var competitor = await _competitorRepository.GetByIdAsync(competitorId);
            if (competitor is null || competitor.UserId != userId)
                return ApiResponse<PaginatedResponse<ChangelogEntryResponse>>.Fail("Competitor not found.");

            var items  = await _changelogRepository.GetByCompetitorIdAsync(competitorId, page, pageSize);
            var total  = await _changelogRepository.GetCountByCompetitorIdAsync(competitorId);
            var mapped = _mapper.Map<List<ChangelogEntryResponse>>(items);

            var paginated = PaginatedResponse<ChangelogEntryResponse>.Create(mapped, total, page, pageSize);
            return ApiResponse<PaginatedResponse<ChangelogEntryResponse>>.Ok(paginated);
        }
        catch (Exception)
        {
            return ApiResponse<PaginatedResponse<ChangelogEntryResponse>>.Fail("Failed to retrieve changelog entries.");
        }
    }
}
