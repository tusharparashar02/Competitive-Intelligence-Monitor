using AutoMapper;
using Backend.BusinessLayer.Interfaces;
using Backend.Models.DTOs.Requests;
using Backend.Models.DTOs.Responses;
using Backend.Models.Entities;
using Backend.RepositoryLayer.Interfaces;

namespace Backend.BusinessLayer.Services;

public class CompetitorService : ICompetitorService
{
    private readonly ICompetitorRepository _competitorRepository;
    private readonly IMapper _mapper;

    public CompetitorService(ICompetitorRepository competitorRepository, IMapper mapper)
    {
        _competitorRepository = competitorRepository;
        _mapper               = mapper;
    }

    public async Task<ApiResponse<CompetitorResponse>> CreateAsync(
        CreateCompetitorRequest request, Guid userId)
    {
        try
        {
            var competitor = _mapper.Map<Competitor>(request);
            competitor.UserId = userId;

            await _competitorRepository.AddAsync(competitor);

            var response = _mapper.Map<CompetitorResponse>(competitor);
            return ApiResponse<CompetitorResponse>.Ok(response, "Competitor created successfully.");
        }
        catch (Exception ex)
        {
            return ApiResponse<CompetitorResponse>.Fail($"Failed to create competitor: {ex.Message}");
        }
    }

    public async Task<ApiResponse<IEnumerable<CompetitorResponse>>> GetAllAsync(Guid userId)
    {
        try
        {
            var competitors = await _competitorRepository.GetByUserIdAsync(userId);
            var response    = _mapper.Map<IEnumerable<CompetitorResponse>>(competitors);
            return ApiResponse<IEnumerable<CompetitorResponse>>.Ok(response);
        }
        catch (Exception)
        {
            return ApiResponse<IEnumerable<CompetitorResponse>>.Fail("Failed to retrieve competitors.");
        }
    }

    public async Task<ApiResponse<CompetitorResponse>> GetByIdAsync(Guid id, Guid userId)
    {
        try
        {
            var competitor = await _competitorRepository.GetByIdAsync(id);

            if (competitor is null || competitor.UserId != userId)
                return ApiResponse<CompetitorResponse>.Fail("Competitor not found.");

            var response = _mapper.Map<CompetitorResponse>(competitor);
            return ApiResponse<CompetitorResponse>.Ok(response);
        }
        catch (Exception)
        {
            return ApiResponse<CompetitorResponse>.Fail("Failed to retrieve competitor.");
        }
    }

    public async Task<ApiResponse<CompetitorResponse>> UpdateAsync(
        Guid id, UpdateCompetitorRequest request, Guid userId)
    {
        try
        {
            var competitor = await _competitorRepository.GetByIdAsync(id);

            if (competitor is null || competitor.UserId != userId)
                return ApiResponse<CompetitorResponse>.Fail("Competitor not found.");

            // Apply only non-null fields from the request
            if (request.Name is not null)                competitor.Name                = request.Name;
            if (request.WebsiteUrl is not null)          competitor.WebsiteUrl          = request.WebsiteUrl;
            if (request.LinkedInUrl is not null)         competitor.LinkedInUrl         = request.LinkedInUrl;
            if (request.IndeedSearchTerm is not null)    competitor.IndeedSearchTerm    = request.IndeedSearchTerm;
            if (request.RssChangelogUrl is not null)     competitor.RssChangelogUrl     = request.RssChangelogUrl;
            if (request.RedditSearchTerm is not null)    competitor.RedditSearchTerm    = request.RedditSearchTerm;
            if (request.MonitoringFrequency is not null) competitor.MonitoringFrequency = request.MonitoringFrequency.Value;
            if (request.Notes is not null)               competitor.Notes               = request.Notes;
            if (request.IsActive is not null)            competitor.IsActive            = request.IsActive.Value;

            await _competitorRepository.UpdateAsync(competitor);

            var response = _mapper.Map<CompetitorResponse>(competitor);
            return ApiResponse<CompetitorResponse>.Ok(response, "Competitor updated successfully.");
        }
        catch (Exception)
        {
            return ApiResponse<CompetitorResponse>.Fail("Failed to update competitor.");
        }
    }

    public async Task<ApiResponse<bool>> DeleteAsync(Guid id, Guid userId)
    {
        try
        {
            var competitor = await _competitorRepository.GetByIdAsync(id);

            if (competitor is null || competitor.UserId != userId)
                return ApiResponse<bool>.Fail("Competitor not found.");

            // Soft delete — preserve data for historical reports
            competitor.IsActive = false;
            await _competitorRepository.UpdateAsync(competitor);

            return ApiResponse<bool>.Ok(true, "Competitor deleted successfully.");
        }
        catch (Exception)
        {
            return ApiResponse<bool>.Fail("Failed to delete competitor.");
        }
    }
}
