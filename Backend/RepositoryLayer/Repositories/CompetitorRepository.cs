using Backend.Data;
using Backend.Models.Entities;
using Backend.RepositoryLayer.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.RepositoryLayer.Repositories;

public class CompetitorRepository : BaseRepository<Competitor>, ICompetitorRepository
{
    public CompetitorRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<Competitor>> GetByUserIdAsync(Guid userId) =>
        await _dbSet
            .AsNoTracking()
            .Where(c => c.UserId == userId)
            .OrderBy(c => c.Name)
            .ToListAsync();

    public async Task<Competitor?> GetWithDetailsAsync(Guid id) =>
        await _dbSet
            .AsNoTracking()
            .Include(c => c.JobPostings)
            .Include(c => c.PageChanges)
            .Include(c => c.RedditMentions)
            .Include(c => c.ChangelogEntries)
            .FirstOrDefaultAsync(c => c.Id == id);

    public async Task<IEnumerable<Competitor>> GetActiveCompetitorsAsync() =>
        await _dbSet
            .AsNoTracking()
            .Where(c => c.IsActive)
            .OrderBy(c => c.Name)
            .ToListAsync();
}
