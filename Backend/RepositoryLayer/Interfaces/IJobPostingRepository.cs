using Backend.Models.Entities;

namespace Backend.RepositoryLayer.Interfaces;

public interface IJobPostingRepository : IBaseRepository<JobPosting>
{
    Task<IEnumerable<JobPosting>> GetByCompetitorIdAsync(Guid competitorId, int page, int pageSize);
    Task<int> GetCountByCompetitorIdAsync(Guid competitorId);
    Task<bool> JobExistsAsync(Guid competitorId, string title, string? location);
}
