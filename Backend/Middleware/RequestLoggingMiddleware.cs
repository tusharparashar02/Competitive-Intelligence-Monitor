using System.Diagnostics;

namespace Backend.Middleware;

public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestLoggingMiddleware> _logger;

    public RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
    {
        _next   = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (context.Request.Path.StartsWithSegments("/health"))
        {
            await _next(context);
            return;
        }

        var sw = Stopwatch.StartNew();

        _logger.LogInformation("Incoming {Method} {Path} at {Time}",
            context.Request.Method,
            context.Request.Path,
            DateTime.UtcNow);

        await _next(context);

        sw.Stop();

        _logger.LogInformation("Response {StatusCode} for {Method} {Path} in {ElapsedMs}ms",
            context.Response.StatusCode,
            context.Request.Method,
            context.Request.Path,
            sw.ElapsedMilliseconds);
    }
}
