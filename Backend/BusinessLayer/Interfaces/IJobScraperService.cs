using Backend.Models.Entities;

namespace Backend.BusinessLayer.Interfaces;

public interface IJobScraperService
{
    Task<int> ScrapeJobPostingsAsync(Competitor competitor, CancellationToken ct = default);
}
