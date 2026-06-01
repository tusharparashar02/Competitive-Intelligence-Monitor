using Backend.BusinessLayer.Interfaces;
using Backend.Helpers;
using Backend.Models.DTOs.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/alerts")]
[Authorize]
[Produces("application/json")]
public class AlertsController : ControllerBase
{
    private readonly IAlertService _alertService;

    public AlertsController(IAlertService alertService) => _alertService = alertService;

    /// <summary>Get all alerts for the authenticated user, optionally filtered to unread only.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<AlertResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAlerts([FromQuery] bool unreadOnly = false)
    {
        var userId = HttpContext.GetCurrentUserId();
        var result = await _alertService.GetAlertsAsync(userId, unreadOnly);
        return Ok(result);
    }

    /// <summary>Get the count of unread alerts for the authenticated user.</summary>
    [HttpGet("unread-count")]
    [ProducesResponseType(typeof(ApiResponse<int>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetUnreadCount()
    {
        var userId = HttpContext.GetCurrentUserId();
        var result = await _alertService.GetUnreadCountAsync(userId);
        return Ok(result);
    }

    /// <summary>Mark a specific alert as read.</summary>
    [HttpPut("{id:guid}/read")]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> MarkAsRead([FromRoute] Guid id)
    {
        var userId = HttpContext.GetCurrentUserId();
        var result = await _alertService.MarkAsReadAsync(id, userId);

        if (!result.Success) return NotFound(result);
        return Ok(result);
    }

    /// <summary>Mark all alerts as read for the authenticated user.</summary>
    [HttpPut("read-all")]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    public async Task<IActionResult> MarkAllAsRead()
    {
        var userId = HttpContext.GetCurrentUserId();
        var result = await _alertService.MarkAllAsReadAsync(userId);
        return Ok(result);
    }
}
