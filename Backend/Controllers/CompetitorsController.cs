using Backend.BusinessLayer.Interfaces;
using Backend.Helpers;
using Backend.Models.DTOs.Requests;
using Backend.Models.DTOs.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/competitors")]
[Authorize]
[Produces("application/json")]
public class CompetitorsController : ControllerBase
{
    private readonly ICompetitorService _competitorService;

    public CompetitorsController(ICompetitorService competitorService) =>
        _competitorService = competitorService;

    /// <summary>Get all competitors for the authenticated user.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<CompetitorResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
        var userId = HttpContext.GetCurrentUserId();
        var result = await _competitorService.GetAllAsync(userId);
        return Ok(result);
    }

    /// <summary>Create a new competitor to monitor.</summary>
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<CompetitorResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateCompetitorRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var userId = HttpContext.GetCurrentUserId();
        var result = await _competitorService.CreateAsync(request, userId);
        return Ok(result);
    }

    /// <summary>Get a single competitor by ID.</summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<CompetitorResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById([FromRoute] Guid id)
    {
        var userId = HttpContext.GetCurrentUserId();
        var result = await _competitorService.GetByIdAsync(id, userId);

        if (!result.Success) return NotFound(result);
        return Ok(result);
    }

    /// <summary>Update an existing competitor.</summary>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<CompetitorResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] UpdateCompetitorRequest request)
    {
        var userId = HttpContext.GetCurrentUserId();
        var result = await _competitorService.UpdateAsync(id, request, userId);

        if (!result.Success) return NotFound(result);
        return Ok(result);
    }

    /// <summary>Soft-delete a competitor (sets IsActive = false).</summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete([FromRoute] Guid id)
    {
        var userId = HttpContext.GetCurrentUserId();
        var result = await _competitorService.DeleteAsync(id, userId);

        if (!result.Success) return NotFound(result);
        return Ok(result);
    }
}
