using Backend.Data;
using Backend.Models.Entities;
using Backend.RepositoryLayer.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.RepositoryLayer.Repositories;

public class RedditMentionRepository : BaseRepository<RedditMention>, IRedditMentionRepository
{
    public RedditMentionRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<RedditMention>> GetByCompetitorIdAsync(
        Guid competitorId, int page, int pageSize) =>
        await _dbSet
            .AsNoTracking()
            .Where(r => r.CompetitorId == competitorId)
            .OrderByDescending(r => r.PostedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

    public async Task<double> GetAverageSentimentAsync(Guid competitorId, int lastDays)
    {
        var cutoff = DateTime.UtcNow.AddDays(-lastDays);

        var scores = await _dbSet
            .AsNoTracking()
            .Where(r => r.CompetitorId == competitorId && r.ScrapedAt >= cutoff)
            .Select(r => r.SentimentScore)
            .ToListAsync();

        return scores.Count == 0 ? 0 : scores.Average();
    }

    public async Task<int> GetCountByCompetitorIdAsync(Guid competitorId) =>
        await _dbSet.CountAsync(r => r.CompetitorId == competitorId);
}
