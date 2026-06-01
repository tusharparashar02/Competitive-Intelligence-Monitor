using Backend.BusinessLayer.Interfaces;
using Backend.Helpers;
using Backend.Models.DTOs.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/competitors/{competitorId:guid}/reviews")]
[Authorize]
[Produces("application/json")]
public class RedditController : ControllerBase
{
    private readonly IRedditService _redditService;

    public RedditController(IRedditService redditService) => _redditService = redditService;

    /// <summary>Get paginated Reddit mentions for a competitor.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<PaginatedResponse<RedditMentionResponse>>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetMentions(
        [FromRoute] Guid competitorId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var userId = HttpContext.GetCurrentUserId();
        var result = await _redditService.GetMentionsAsync(competitorId, userId, page, pageSize);

        if (!result.Success) return NotFound(result);
        return Ok(result);
    }

    /// <summary>Get sentiment trend score for a competitor over the last N days.</summary>
    [HttpGet("sentiment")]
    [ProducesResponseType(typeof(ApiResponse<double>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetSentimentTrend(
        [FromRoute] Guid competitorId,
        [FromQuery] int lastDays = 30)
    {
        var userId = HttpContext.GetCurrentUserId();
        var result = await _redditService.GetSentimentTrendAsync(competitorId, userId, lastDays);

        if (!result.Success) return NotFound(result);
        return Ok(result);
    }
}
