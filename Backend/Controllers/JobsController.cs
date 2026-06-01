using Backend.BusinessLayer.Interfaces;
using Backend.Helpers;
using Backend.Models.DTOs.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/competitors/{competitorId:guid}/jobs")]
[Authorize]
[Produces("application/json")]
public class JobsController : ControllerBase
{
    private readonly IJobService _jobService;

    public JobsController(IJobService jobService) => _jobService = jobService;

    /// <summary>Get paginated job postings scraped for a competitor.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<PaginatedResponse<JobPostingResponse>>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetJobs(
        [FromRoute] Guid competitorId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var userId = HttpContext.GetCurrentUserId();
        var result = await _jobService.GetJobsAsync(competitorId, userId, page, pageSize);

        if (!result.Success) return NotFound(result);
        return Ok(result);
    }
}
