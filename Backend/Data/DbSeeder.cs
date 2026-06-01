using Backend.Data;
using Backend.Models.Entities;
using Backend.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var db     = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<AppDbContext>>();

        try
        {
            await db.Database.MigrateAsync();

            if (await db.Users.AnyAsync())
                return;

            logger.LogInformation("Seeding database with initial data...");

            var user = new User
            {
                Id           = Guid.NewGuid(),
                Name         = "Test User",
                Email        = "test@gmail.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("test123"),
                CreatedAt    = DateTime.UtcNow,
                UpdatedAt    = DateTime.UtcNow
            };

            await db.Users.AddAsync(user);

            var competitors = new List<Competitor>
            {
                new()
                {
                    Id                  = Guid.NewGuid(),
                    UserId              = user.Id,
                    Name                = "Notion",
                    WebsiteUrl          = "https://notion.so",
                    RssChangelogUrl     = "https://www.notion.so/releases/rss.xml",
                    RedditSearchTerm    = "Notion app",
                    IndeedSearchTerm    = "Notion",
                    MonitoringFrequency = MonitoringFrequency.Daily,
                    IsActive            = true,
                    CreatedAt           = DateTime.UtcNow
                },
                new()
                {
                    Id                  = Guid.NewGuid(),
                    UserId              = user.Id,
                    Name                = "Linear",
                    WebsiteUrl          = "https://linear.app",
                    RssChangelogUrl     = "https://linear.app/changelog/rss.xml",
                    RedditSearchTerm    = "Linear app",
                    IndeedSearchTerm    = "Linear",
                    MonitoringFrequency = MonitoringFrequency.Daily,
                    IsActive            = true,
                    CreatedAt           = DateTime.UtcNow
                }
            };

            await db.Competitors.AddRangeAsync(competitors);
            await db.SaveChangesAsync();

            logger.LogInformation("Database seeded successfully.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while seeding the database.");
            throw;
        }
    }
}
