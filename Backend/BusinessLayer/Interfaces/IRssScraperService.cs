using Backend.Models.Entities;

namespace Backend.BusinessLayer.Interfaces;

public interface IRssScraperService
{
    Task<int> ScrapeChangelogAsync(Competitor competitor, CancellationToken ct = default);
}
