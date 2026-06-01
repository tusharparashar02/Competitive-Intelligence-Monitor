using Backend.Data;
using Backend.Models.Entities;
using Backend.RepositoryLayer.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.RepositoryLayer.Repositories;

public class ChangelogRepository : BaseRepository<ChangelogEntry>, IChangelogRepository
{
    public ChangelogRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<ChangelogEntry>> GetByCompetitorIdAsync(
        Guid competitorId, int page, int pageSize) =>
        await _dbSet
            .AsNoTracking()
            .Where(c => c.CompetitorId == competitorId)
            .OrderByDescending(c => c.PublishedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

    public async Task<DateTime?> GetLatestEntryDateAsync(Guid competitorId) =>
        await _dbSet
            .AsNoTracking()
            .Where(c => c.CompetitorId == competitorId)
            .OrderByDescending(c => c.PublishedAt)
            .Select(c => (DateTime?)c.PublishedAt)
            .FirstOrDefaultAsync();

    public async Task<int> GetCountByCompetitorIdAsync(Guid competitorId) =>
        await _dbSet.CountAsync(c => c.CompetitorId == competitorId);
}
