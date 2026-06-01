using Backend.Models.Entities;

namespace Backend.RepositoryLayer.Interfaces;

public interface ICompetitorRepository : IBaseRepository<Competitor>
{
    Task<IEnumerable<Competitor>> GetByUserIdAsync(Guid userId);
    Task<Competitor?> GetWithDetailsAsync(Guid id);
    Task<IEnumerable<Competitor>> GetActiveCompetitorsAsync();
}
