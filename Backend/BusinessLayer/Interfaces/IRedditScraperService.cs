using Backend.Models.Entities;

namespace Backend.BusinessLayer.Interfaces;

public interface IRedditScraperService
{
    Task<int> ScrapeRedditAsync(Competitor competitor, CancellationToken ct = default);
}
