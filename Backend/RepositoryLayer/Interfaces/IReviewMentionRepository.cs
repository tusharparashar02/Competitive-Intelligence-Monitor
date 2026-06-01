using Backend.Models.Entities;

namespace Backend.RepositoryLayer.Interfaces;

public interface IRedditMentionRepository : IBaseRepository<RedditMention>
{
    Task<IEnumerable<RedditMention>> GetByCompetitorIdAsync(Guid competitorId, int page, int pageSize);
    Task<int> GetCountByCompetitorIdAsync(Guid competitorId);
    Task<double> GetAverageSentimentAsync(Guid competitorId, int lastDays);
}
