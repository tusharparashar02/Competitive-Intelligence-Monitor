using AutoMapper;
using Backend.Models.DTOs.Requests;
using Backend.Models.DTOs.Responses;
using Backend.Models.Entities;

namespace Backend.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // ── User ──────────────────────────────────────────────────────────────
        CreateMap<User, UserResponse>();

        CreateMap<RegisterRequest, User>()
            .ForMember(dest => dest.Id,           opt => opt.Ignore())
            .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt,    opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt,    opt => opt.Ignore())
            .ForMember(dest => dest.Competitors,  opt => opt.Ignore())
            .ForMember(dest => dest.Reports,      opt => opt.Ignore())
            .ForMember(dest => dest.Alerts,       opt => opt.Ignore());

        // ── Competitor ────────────────────────────────────────────────────────
        CreateMap<Competitor, CompetitorResponse>()
            .ForMember(dest => dest.MonitoringFrequency,
                       opt => opt.MapFrom(src => src.MonitoringFrequency.ToString()))
            .ForMember(dest => dest.TotalAlerts,
                       opt => opt.Ignore()); // populated by service layer

        CreateMap<CreateCompetitorRequest, Competitor>()
            .ForMember(dest => dest.Id,              opt => opt.Ignore())
            .ForMember(dest => dest.UserId,          opt => opt.Ignore())
            .ForMember(dest => dest.IsActive,        opt => opt.Ignore())
            .ForMember(dest => dest.LastMonitoredAt, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt,       opt => opt.Ignore())
            .ForMember(dest => dest.User,            opt => opt.Ignore())
            .ForMember(dest => dest.JobPostings,     opt => opt.Ignore())
            .ForMember(dest => dest.PageChanges,     opt => opt.Ignore())
            .ForMember(dest => dest.RedditMentions,  opt => opt.Ignore())
            .ForMember(dest => dest.ChangelogEntries,opt => opt.Ignore());

        CreateMap<UpdateCompetitorRequest, Competitor>()
            .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));

        // ── JobPosting ────────────────────────────────────────────────────────
        CreateMap<JobPosting, JobPostingResponse>();

        // ── PageChange ────────────────────────────────────────────────────────
        CreateMap<PageChange, PageChangeResponse>()
            .ForMember(dest => dest.ChangeType,
                       opt => opt.MapFrom(src => src.ChangeType.ToString()))
            .ForMember(dest => dest.Severity,
                       opt => opt.MapFrom(src => src.Severity.ToString()));

        // ── RedditMention ─────────────────────────────────────────────────────
        CreateMap<RedditMention, RedditMentionResponse>();

        // ── ChangelogEntry ────────────────────────────────────────────────────
        CreateMap<ChangelogEntry, ChangelogEntryResponse>();

        // ── WeeklyReport ──────────────────────────────────────────────────────
        CreateMap<WeeklyReport, WeeklyReportResponse>();

        // ── Alert ─────────────────────────────────────────────────────────────
        CreateMap<Alert, AlertResponse>()
            .ForMember(dest => dest.AlertType,
                       opt => opt.MapFrom(src => src.AlertType.ToString()))
            .ForMember(dest => dest.Severity,
                       opt => opt.MapFrom(src => src.Severity.ToString()));
    }
}
