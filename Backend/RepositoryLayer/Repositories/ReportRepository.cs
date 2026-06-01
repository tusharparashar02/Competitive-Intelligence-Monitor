using Backend.Data;
using Backend.Models.Entities;
using Backend.RepositoryLayer.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.RepositoryLayer.Repositories;

public class ReportRepository : BaseRepository<WeeklyReport>, IReportRepository
{
    public ReportRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<WeeklyReport>> GetByUserIdAsync(Guid userId) =>
        await _dbSet
            .AsNoTracking()
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.GeneratedAt)
            .ToListAsync();

    public async Task<WeeklyReport?> GetLatestReportAsync(Guid userId) =>
        await _dbSet
            .AsNoTracking()
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.GeneratedAt)
            .FirstOrDefaultAsync();
}
