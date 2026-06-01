using Backend.Data;
using Backend.Models.Entities;
using Backend.RepositoryLayer.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.RepositoryLayer.Repositories;

public class AlertRepository : BaseRepository<Alert>, IAlertRepository
{
    public AlertRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<Alert>> GetByUserIdAsync(Guid userId, bool unreadOnly = false)
    {
        var query = _dbSet
            .AsNoTracking()
            .Where(a => a.UserId == userId);

        if (unreadOnly)
            query = query.Where(a => !a.IsRead);

        return await query
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();
    }

    public async Task<int> GetUnreadCountAsync(Guid userId) =>
        await _dbSet.CountAsync(a => a.UserId == userId && !a.IsRead);

    public async Task MarkAsReadAsync(Guid alertId)
    {
        var alert = await _dbSet.FindAsync(alertId);
        if (alert is null) return;

        alert.IsRead = true;
        await _context.SaveChangesAsync();
    }

    public async Task MarkAllAsReadAsync(Guid userId)
    {
        await _dbSet
            .Where(a => a.UserId == userId && !a.IsRead)
            .ExecuteUpdateAsync(s => s.SetProperty(a => a.IsRead, true));
    }
}
