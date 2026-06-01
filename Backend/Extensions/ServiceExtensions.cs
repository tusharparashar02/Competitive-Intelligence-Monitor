using System.Text;
using Backend.BusinessLayer.Interfaces;
using Backend.BusinessLayer.Services;
using Backend.Data;
using Backend.Mappings;
using Backend.RepositoryLayer.Interfaces;
using Backend.RepositoryLayer.Repositories;
using Hangfire;
using Hangfire.SqlServer;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

namespace Backend.Extensions;

public static class ServiceExtensions
{
    public static IServiceCollection AddRepositories(this IServiceCollection services)
    {
        services.AddScoped<IUserRepository,          UserRepository>();
        services.AddScoped<ICompetitorRepository,    CompetitorRepository>();
        services.AddScoped<IJobPostingRepository,    JobPostingRepository>();
        services.AddScoped<IPageChangeRepository,    PageChangeRepository>();
        services.AddScoped<IRedditMentionRepository, RedditMentionRepository>();
        services.AddScoped<IChangelogRepository,     ChangelogRepository>();
        services.AddScoped<IReportRepository,        ReportRepository>();
        services.AddScoped<IAlertRepository,         AlertRepository>();
        return services;
    }

    public static IServiceCollection AddBusinessServices(this IServiceCollection services)
    {
        services.AddScoped<IAuthService,       AuthService>();
        services.AddScoped<ICompetitorService, CompetitorService>();
        services.AddScoped<IJobService,        JobService>();
        services.AddScoped<IPageChangeService, PageChangeService>();
        services.AddScoped<IRedditService,     RedditService>();
        services.AddScoped<IChangelogService,  ChangelogService>();
        services.AddScoped<IReportService,     ReportService>();
        services.AddScoped<IAlertService,      AlertService>();

        // Scraper services
        services.AddScoped<IRssScraperService,    RssScraperService>();
        services.AddScoped<IJobScraperService,    JobScraperService>();
        services.AddScoped<IRedditScraperService, RedditScraperService>();
        services.AddScoped<IPageSnapshotService,  PageSnapshotService>();
        services.AddScoped<IScraperOrchestrator,  ScraperOrchestratorService>();

        return services;
    }

    public static IServiceCollection AddHttpClients(this IServiceCollection services)
    {
        services.AddHttpClient("scraper", client =>
        {
            client.Timeout = TimeSpan.FromSeconds(30);
            client.DefaultRequestHeaders.Add("Accept", "text/html,application/json,*/*");
        });

        return services;
    }

    public static IServiceCollection AddCorsPolicy(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddPolicy("FrontendDev", policy =>
                policy
                    .WithOrigins(
                        "http://localhost:5173",          // Vite dev server
                        "http://localhost:4173",          // Vite preview
                        "https://your-vercel-app.vercel.app" // Production
                    )
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials());                 // Required for SignalR
        });

        return services;
    }

    public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration config)
    {
        var secret   = config["JwtSettings:Secret"]!;
        var issuer   = config["JwtSettings:Issuer"]!;
        var audience = config["JwtSettings:Audience"]!;

        services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey         = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret)),
                    ValidateIssuer           = true,
                    ValidIssuer              = issuer,
                    ValidateAudience         = true,
                    ValidAudience            = audience,
                    ValidateLifetime         = true,
                    ClockSkew                = TimeSpan.Zero
                };

                // Allow SignalR to pass token via query string
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = ctx =>
                    {
                        var accessToken = ctx.Request.Query["access_token"];
                        var path        = ctx.HttpContext.Request.Path;
                        if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
                            ctx.Token = accessToken;
                        return Task.CompletedTask;
                    }
                };
            });

        return services;
    }

    public static IServiceCollection AddHangfireServices(this IServiceCollection services, IConfiguration config)
    {
        var connectionString = config.GetConnectionString("DefaultConnection")!;

        services.AddHangfire(cfg => cfg
            .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
            .UseSimpleAssemblyNameTypeSerializer()
            .UseRecommendedSerializerSettings()
            .UseSqlServerStorage(connectionString, new SqlServerStorageOptions
            {
                CommandBatchMaxTimeout       = TimeSpan.FromMinutes(5),
                SlidingInvisibilityTimeout   = TimeSpan.FromMinutes(5),
                QueuePollInterval            = TimeSpan.Zero,
                UseRecommendedIsolationLevel = true,
                DisableGlobalLocks           = true
            }));

        services.AddHangfireServer();
        return services;
    }

    public static IServiceCollection AddSwaggerWithJwt(this IServiceCollection services)
    {
        services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo
            {
                Title   = "Competitive Intelligence Monitor API",
                Version = "v1"
            });

            var jwtScheme = new OpenApiSecurityScheme
            {
                Name         = "Authorization",
                Type         = SecuritySchemeType.Http,
                Scheme       = "bearer",
                BearerFormat = "JWT",
                In           = ParameterLocation.Header,
                Description  = "Enter your JWT token. Example: Bearer {token}",
                Reference    = new OpenApiReference
                {
                    Id   = JwtBearerDefaults.AuthenticationScheme,
                    Type = ReferenceType.SecurityScheme
                }
            };

            options.AddSecurityDefinition(jwtScheme.Reference.Id, jwtScheme);
            options.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                { jwtScheme, Array.Empty<string>() }
            });
        });

        return services;
    }

    public static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration config)
    {
        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(config.GetConnectionString("DefaultConnection")));
        return services;
    }
}
