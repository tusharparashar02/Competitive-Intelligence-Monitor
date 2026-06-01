using Backend.BusinessLayer.Interfaces;
using Backend.Helpers;
using Backend.Models.DTOs.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/reports")]
[Authorize]
[Produces("application/json")]
public class ReportsController : ControllerBase
{
    private readonly IReportService _reportService;

    public ReportsController(IReportService reportService) => _reportService = reportService;

    /// <summary>Get all weekly reports for the authenticated user.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<WeeklyReportResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetReports()
    {
        var userId = HttpContext.GetCurrentUserId();
        var result = await _reportService.GetReportsAsync(userId);
        return Ok(result);
    }

    /// <summary>Get a single weekly report by ID.</summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<WeeklyReportResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetReportById([FromRoute] Guid id)
    {
        var userId = HttpContext.GetCurrentUserId();
        var result = await _reportService.GetReportByIdAsync(id, userId);

        if (!result.Success) return NotFound(result);
        return Ok(result);
    }
}
