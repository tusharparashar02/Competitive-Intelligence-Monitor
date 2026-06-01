using Backend.Models.Entities;

namespace Backend.RepositoryLayer.Interfaces;

public interface IPageChangeRepository : IBaseRepository<PageChange>
{
    Task<IEnumerable<PageChange>> GetByCompetitorIdAsync(Guid competitorId, int page, int pageSize);
    Task<int> GetCountByCompetitorIdAsync(Guid competitorId);
    Task<PageSnapshot?> GetLatestSnapshotAsync(Guid competitorId, string pageUrl);
    Task SaveSnapshotAsync(PageSnapshot snapshot);
}
