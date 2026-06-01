using AutoMapper;
using Backend.BusinessLayer.Interfaces;
using Backend.Models.DTOs.Responses;
using Backend.RepositoryLayer.Interfaces;

namespace Backend.BusinessLayer.Services;

public class RedditService : IRedditService
{
    private readonly IRedditMentionRepository _redditRepository;
    private readonly ICompetitorRepository    _competitorRepository;
    private readonly IMapper                  _mapper;

    public RedditService(
        IRedditMentionRepository redditRepository,
        ICompetitorRepository competitorRepository,
        IMapper mapper)
    {
        _redditRepository     = redditRepository;
        _competitorRepository = competitorRepository;
        _mapper               = mapper;
    }

    public async Task<ApiResponse<PaginatedResponse<RedditMentionResponse>>> GetMentionsAsync(
        Guid competitorId, Guid userId, int page, int pageSize)
    {
        try
        {
            var competitor = await _competitorRepository.GetByIdAsync(competitorId);
            if (competitor is null || competitor.UserId != userId)
                return ApiResponse<PaginatedResponse<RedditMentionResponse>>.Fail("Competitor not found.");

            var items  = await _redditRepository.GetByCompetitorIdAsync(competitorId, page, pageSize);
            var total  = await _redditRepository.GetCountByCompetitorIdAsync(competitorId);
            var mapped = _mapper.Map<List<RedditMentionResponse>>(items);

            var paginated = PaginatedResponse<RedditMentionResponse>.Create(mapped, total, page, pageSize);
            return ApiResponse<PaginatedResponse<RedditMentionResponse>>.Ok(paginated);
        }
        catch (Exception)
        {
            return ApiResponse<PaginatedResponse<RedditMentionResponse>>.Fail("Failed to retrieve Reddit mentions.");
        }
    }

    public async Task<ApiResponse<double>> GetSentimentTrendAsync(
        Guid competitorId, Guid userId, int lastDays)
    {
        try
        {
            var competitor = await _competitorRepository.GetByIdAsync(competitorId);
            if (competitor is null || competitor.UserId != userId)
                return ApiResponse<double>.Fail("Competitor not found.");

            var average = await _redditRepository.GetAverageSentimentAsync(competitorId, lastDays);
            return ApiResponse<double>.Ok(average);
        }
        catch (Exception)
        {
            return ApiResponse<double>.Fail("Failed to retrieve sentiment trend.");
        }
    }
}
