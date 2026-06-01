using AutoMapper;
using Backend.BusinessLayer.Interfaces;
using Backend.Models.DTOs.Responses;
using Backend.RepositoryLayer.Interfaces;

namespace Backend.BusinessLayer.Services;

public class PageChangeService : IPageChangeService
{
    private readonly IPageChangeRepository  _pageChangeRepository;
    private readonly ICompetitorRepository  _competitorRepository;
    private readonly IMapper                _mapper;

    public PageChangeService(
        IPageChangeRepository pageChangeRepository,
        ICompetitorRepository competitorRepository,
        IMapper mapper)
    {
        _pageChangeRepository = pageChangeRepository;
        _competitorRepository = competitorRepository;
        _mapper               = mapper;
    }

    public async Task<ApiResponse<PaginatedResponse<PageChangeResponse>>> GetChangesAsync(
        Guid competitorId, Guid userId, int page, int pageSize)
    {
        try
        {
            var competitor = await _competitorRepository.GetByIdAsync(competitorId);
            if (competitor is null || competitor.UserId != userId)
                return ApiResponse<PaginatedResponse<PageChangeResponse>>.Fail("Competitor not found.");

            var items  = await _pageChangeRepository.GetByCompetitorIdAsync(competitorId, page, pageSize);
            var total  = await _pageChangeRepository.GetCountByCompetitorIdAsync(competitorId);
            var mapped = _mapper.Map<List<PageChangeResponse>>(items);

            var paginated = PaginatedResponse<PageChangeResponse>.Create(mapped, total, page, pageSize);
            return ApiResponse<PaginatedResponse<PageChangeResponse>>.Ok(paginated);
        }
        catch (Exception)
        {
            return ApiResponse<PaginatedResponse<PageChangeResponse>>.Fail("Failed to retrieve page changes.");
        }
    }
}
