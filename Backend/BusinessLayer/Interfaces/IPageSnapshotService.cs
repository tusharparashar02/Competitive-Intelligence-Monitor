using Backend.Models.Entities;

namespace Backend.BusinessLayer.Interfaces;

public interface IPageSnapshotService
{
    Task TakePageSnapshotAsync(Competitor competitor, CancellationToken ct = default);
}
