using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("health")]
[Produces("application/json")]
public class HealthController : ControllerBase
{
    /// <summary>Health check endpoint used by Render hosting to verify the API is running.</summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult Get() =>
        Ok(new { message = "API is running", utc = DateTime.UtcNow });
}
