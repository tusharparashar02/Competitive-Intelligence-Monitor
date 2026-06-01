using Backend.Data;
using Backend.Models.Entities;
using Backend.RepositoryLayer.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.RepositoryLayer.Repositories;

public class JobPostingRepository : BaseRepository<JobPosting>, IJobPostingRepository
{
    public JobPostingRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<JobPosting>> GetByCompetitorIdAsync(
        Guid competitorId, int page, int pageSize) =>
        await _dbSet
            .AsNoTracking()
            .Where(j => j.CompetitorId == competitorId)
            .OrderByDescending(j => j.ScrapedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

    public async Task<int> GetCountByCompetitorIdAsync(Guid competitorId) =>
        await _dbSet.CountAsync(j => j.CompetitorId == competitorId);

    public async Task<bool> JobExistsAsync(Guid competitorId, string title, string? location) =>
        await _dbSet.AnyAsync(j =>
            j.CompetitorId == competitorId &&
            j.Title == title &&
            j.Location == location);
}
