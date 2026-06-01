using Backend.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // ── DbSets ────────────────────────────────────────────────────────────────
    public DbSet<User> Users => Set<User>();
    public DbSet<Competitor> Competitors => Set<Competitor>();
    public DbSet<JobPosting> JobPostings => Set<JobPosting>();
    public DbSet<PageSnapshot> PageSnapshots => Set<PageSnapshot>();
    public DbSet<PageChange> PageChanges => Set<PageChange>();
    public DbSet<RedditMention> RedditMentions => Set<RedditMention>();
    public DbSet<ChangelogEntry> ChangelogEntries => Set<ChangelogEntry>();
    public DbSet<WeeklyReport> WeeklyReports => Set<WeeklyReport>();
    public DbSet<Alert> Alerts => Set<Alert>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ── User ──────────────────────────────────────────────────────────────
        modelBuilder.Entity<User>(e =>
        {
            e.HasKey(u => u.Id);

            e.Property(u => u.Name).IsRequired().HasMaxLength(100);
            e.Property(u => u.Email).IsRequired().HasMaxLength(200);
            e.Property(u => u.PasswordHash).IsRequired();

            // Unique constraint on Email
            e.HasIndex(u => u.Email).IsUnique();
        });

        // ── Competitor ────────────────────────────────────────────────────────
        modelBuilder.Entity<Competitor>(e =>
        {
            e.HasKey(c => c.Id);

            e.Property(c => c.Name).IsRequired().HasMaxLength(200);
            e.Property(c => c.WebsiteUrl).IsRequired();

            // Store enum as string for readability
            e.Property(c => c.MonitoringFrequency).HasConversion<string>();

            e.HasIndex(c => c.UserId);

            e.HasOne(c => c.User)
             .WithMany(u => u.Competitors)
             .HasForeignKey(c => c.UserId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // ── JobPosting ────────────────────────────────────────────────────────
        modelBuilder.Entity<JobPosting>(e =>
        {
            e.HasKey(j => j.Id);

            e.HasIndex(j => j.CompetitorId);

            e.HasOne(j => j.Competitor)
             .WithMany(c => c.JobPostings)
             .HasForeignKey(j => j.CompetitorId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // ── PageSnapshot ──────────────────────────────────────────────────────
        modelBuilder.Entity<PageSnapshot>(e =>
        {
            e.HasKey(p => p.Id);

            e.Property(p => p.RawContent).HasColumnType("nvarchar(max)");

            e.HasIndex(p => p.CompetitorId);

            e.HasOne(p => p.Competitor)
             .WithMany()
             .HasForeignKey(p => p.CompetitorId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // ── PageChange ────────────────────────────────────────────────────────
        modelBuilder.Entity<PageChange>(e =>
        {
            e.HasKey(p => p.Id);

            e.Property(p => p.ChangeType).HasConversion<string>();
            e.Property(p => p.Severity).HasConversion<string>();

            e.HasIndex(p => p.CompetitorId);

            e.HasOne(p => p.Competitor)
             .WithMany(c => c.PageChanges)
             .HasForeignKey(p => p.CompetitorId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // ── RedditMention ─────────────────────────────────────────────────────
        modelBuilder.Entity<RedditMention>(e =>
        {
            e.HasKey(r => r.Id);

            e.HasIndex(r => r.CompetitorId);

            e.HasOne(r => r.Competitor)
             .WithMany(c => c.RedditMentions)
             .HasForeignKey(r => r.CompetitorId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // ── ChangelogEntry ────────────────────────────────────────────────────
        modelBuilder.Entity<ChangelogEntry>(e =>
        {
            e.HasKey(c => c.Id);

            e.HasIndex(c => c.CompetitorId);

            e.HasOne(c => c.Competitor)
             .WithMany(c => c.ChangelogEntries)
             .HasForeignKey(c => c.CompetitorId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // ── WeeklyReport ──────────────────────────────────────────────────────
        modelBuilder.Entity<WeeklyReport>(e =>
        {
            e.HasKey(r => r.Id);

            e.Property(r => r.Content).HasColumnType("nvarchar(max)");

            e.HasIndex(r => r.UserId);

            e.HasOne(r => r.User)
             .WithMany(u => u.Reports)
             .HasForeignKey(r => r.UserId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // ── Alert ─────────────────────────────────────────────────────────────
        modelBuilder.Entity<Alert>(e =>
        {
            e.HasKey(a => a.Id);

            e.Property(a => a.AlertType).HasConversion<string>();
            e.Property(a => a.Severity).HasConversion<string>();

            e.HasIndex(a => a.UserId);

            // Nullable FK to Competitor — no cascade (competitor may be deleted independently)
            e.HasOne(a => a.User)
             .WithMany(u => u.Alerts)
             .HasForeignKey(a => a.UserId)
             .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
