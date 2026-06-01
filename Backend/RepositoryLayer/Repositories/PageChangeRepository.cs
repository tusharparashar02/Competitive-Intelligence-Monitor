using Backend.Data;
using Backend.Models.Entities;
using Backend.RepositoryLayer.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.RepositoryLayer.Repositories;

public class PageChangeRepository : BaseRepository<PageChange>, IPageChangeRepository
{
    public PageChangeRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<PageChange>> GetByCompetitorIdAsync(
        Guid competitorId, int page, int pageSize) =>
        await _dbSet
            .AsNoTracking()
            .Where(p => p.CompetitorId == competitorId)
            .OrderByDescending(p => p.DetectedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

    public async Task<PageSnapshot?> GetLatestSnapshotAsync(Guid competitorId, string pageUrl) =>
        await _context.PageSnapshots
            .AsNoTracking()
            .Where(s => s.CompetitorId == competitorId && s.PageUrl == pageUrl)
            .OrderByDescending(s => s.SnapshotDate)
            .FirstOrDefaultAsync();

    public async Task SaveSnapshotAsync(PageSnapshot snapshot)
    {
        await _context.PageSnapshots.AddAsync(snapshot);
        await _context.SaveChangesAsync();
    }

    public async Task<int> GetCountByCompetitorIdAsync(Guid competitorId) =>
        await _dbSet.CountAsync(p => p.CompetitorId == competitorId);
}
