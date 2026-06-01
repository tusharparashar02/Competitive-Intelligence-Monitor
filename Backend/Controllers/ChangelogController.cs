using Backend.BusinessLayer.Interfaces;
using Backend.Helpers;
using Backend.Models.DTOs.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/competitors/{competitorId:guid}/changelog")]
[Authorize]
[Produces("application/json")]
public class ChangelogController : ControllerBase
{
    private readonly IChangelogService _changelogService;

    public ChangelogController(IChangelogService changelogService) => _changelogService = changelogService;

    /// <summary>Get paginated changelog entries for a competitor.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<PaginatedResponse<ChangelogEntryResponse>>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetEntries(
        [FromRoute] Guid competitorId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var userId = HttpContext.GetCurrentUserId();
        var result = await _changelogService.GetEntriesAsync(competitorId, userId, page, pageSize);

        if (!result.Success) return NotFound(result);
        return Ok(result);
    }
}
