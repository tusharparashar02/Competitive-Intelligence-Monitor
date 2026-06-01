using Backend.Extensions;
using Backend.Hubs;
using Backend.Jobs;
using Backend.Middleware;
using Hangfire;

var builder = WebApplication.CreateBuilder(args);
var config  = builder.Configuration;

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSignalR();

builder.Services.AddDatabase(config);
builder.Services.AddRepositories();
builder.Services.AddBusinessServices();
builder.Services.AddJwtAuthentication(config);
builder.Services.AddHangfireServices(config);
builder.Services.AddSwaggerWithJwt();
builder.Services.AddAutoMapper(typeof(Backend.Mappings.MappingProfile));
builder.Services.AddHttpClients();
builder.Services.AddCorsPolicy();

var app = builder.Build();

await Backend.Data.DbSeeder.SeedAsync(app.Services);

app.UseMiddleware<ExceptionMiddleware>();
app.UseMiddleware<RequestLoggingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("FrontendDev");
app.UseAuthentication();
app.UseAuthorization();
app.UseHangfireDashboard("/hangfire");

using (var scope = app.Services.CreateScope())
{
    var jobManager = scope.ServiceProvider.GetRequiredService<IRecurringJobManager>();
    HangfireJobRegistrar.RegisterJobs(jobManager);
}

app.MapControllers();
app.MapHub<NotificationHub>("/hubs/notifications");

app.Run();
