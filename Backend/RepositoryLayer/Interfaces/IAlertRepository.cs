using Backend.Models.Entities;

namespace Backend.RepositoryLayer.Interfaces;

public interface IAlertRepository : IBaseRepository<Alert>
{
    Task<IEnumerable<Alert>> GetByUserIdAsync(Guid userId, bool unreadOnly = false);
    Task<int> GetUnreadCountAsync(Guid userId);
    Task MarkAsReadAsync(Guid alertId);
    Task MarkAllAsReadAsync(Guid userId);
}
