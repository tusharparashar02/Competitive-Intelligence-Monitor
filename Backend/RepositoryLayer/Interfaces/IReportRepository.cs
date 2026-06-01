using Backend.Models.Entities;

namespace Backend.RepositoryLayer.Interfaces;

public interface IReportRepository : IBaseRepository<WeeklyReport>
{
    Task<IEnumerable<WeeklyReport>> GetByUserIdAsync(Guid userId);
    Task<WeeklyReport?> GetLatestReportAsync(Guid userId);
}
