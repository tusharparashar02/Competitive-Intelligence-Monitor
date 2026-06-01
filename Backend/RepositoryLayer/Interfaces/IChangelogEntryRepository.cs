using Backend.Models.Entities;

namespace Backend.RepositoryLayer.Interfaces;

public interface IChangelogRepository : IBaseRepository<ChangelogEntry>
{
    Task<IEnumerable<ChangelogEntry>> GetByCompetitorIdAsync(Guid competitorId, int page, int pageSize);
    Task<int> GetCountByCompetitorIdAsync(Guid competitorId);
    Task<DateTime?> GetLatestEntryDateAsync(Guid competitorId);
}
