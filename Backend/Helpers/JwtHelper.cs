using System.Security.Claims;

namespace Backend.Helpers;

public static class JwtHelper
{
    /// <summary>
    /// Extracts the authenticated user's Guid from the HttpContext JWT claims.
    /// Returns Guid.Empty if the claim is missing or malformed.
    /// </summary>
    public static Guid GetCurrentUserId(this HttpContext context)
    {
        var claim = context.User.FindFirst("userId")
                 ?? context.User.FindFirst(ClaimTypes.NameIdentifier)
                 ?? context.User.FindFirst("sub");

        if (claim is null || !Guid.TryParse(claim.Value, out var userId))
            return Guid.Empty;

        return userId;
    }

    /// <summary>
    /// Returns true if the current request is authenticated with a valid user id.
    /// </summary>
    public static bool IsAuthenticated(this HttpContext context) =>
        context.GetCurrentUserId() != Guid.Empty;
}
