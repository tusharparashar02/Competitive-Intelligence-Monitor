using Backend.Models.DTOs.Responses;

namespace Backend.BusinessLayer.Interfaces;

public interface IRedditService
{
    Task<ApiResponse<PaginatedResponse<RedditMentionResponse>>> GetMentionsAsync(
        Guid competitorId, Guid userId, int page, int pageSize);

    Task<ApiResponse<double>> GetSentimentTrendAsync(
        Guid competitorId, Guid userId, int lastDays);
}
