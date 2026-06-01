using Backend.BusinessLayer.Interfaces;
using Backend.Helpers;
using Backend.Models.DTOs.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/competitors/{competitorId:guid}/changes")]
[Authorize]
[Produces("application/json")]
public class PageChangesController : ControllerBase
{
    private readonly IPageChangeService _pageChangeService;

    public PageChangesController(IPageChangeService pageChangeService) => _pageChangeService = pageChangeService;

    /// <summary>Get paginated page change records detected for a competitor.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<PaginatedResponse<PageChangeResponse>>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetChanges(
        [FromRoute] Guid competitorId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var userId = HttpContext.GetCurrentUserId();
        var result = await _pageChangeService.GetChangesAsync(competitorId, userId, page, pageSize);

        if (!result.Success) return NotFound(result);
        return Ok(result);
    }
}
