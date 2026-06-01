using AutoMapper;
using Backend.BusinessLayer.Interfaces;
using Backend.Models.DTOs.Responses;
using Backend.RepositoryLayer.Interfaces;

namespace Backend.BusinessLayer.Services;

public class AlertService : IAlertService
{
    private readonly IAlertRepository _alertRepository;
    private readonly IMapper          _mapper;

    public AlertService(IAlertRepository alertRepository, IMapper mapper)
    {
        _alertRepository = alertRepository;
        _mapper          = mapper;
    }

    public async Task<ApiResponse<IEnumerable<AlertResponse>>> GetAlertsAsync(Guid userId, bool unreadOnly)
    {
        try
        {
            var alerts = await _alertRepository.GetByUserIdAsync(userId, unreadOnly);
            var mapped = _mapper.Map<IEnumerable<AlertResponse>>(alerts);
            return ApiResponse<IEnumerable<AlertResponse>>.Ok(mapped);
        }
        catch (Exception)
        {
            return ApiResponse<IEnumerable<AlertResponse>>.Fail("Failed to retrieve alerts.");
        }
    }

    public async Task<ApiResponse<int>> GetUnreadCountAsync(Guid userId)
    {
        try
        {
            var count = await _alertRepository.GetUnreadCountAsync(userId);
            return ApiResponse<int>.Ok(count);
        }
        catch (Exception)
        {
            return ApiResponse<int>.Fail("Failed to retrieve unread count.");
        }
    }

    public async Task<ApiResponse<bool>> MarkAsReadAsync(Guid alertId, Guid userId)
    {
        try
        {
            var alert = await _alertRepository.GetByIdAsync(alertId);

            if (alert is null || alert.UserId != userId)
                return ApiResponse<bool>.Fail("Alert not found.");

            await _alertRepository.MarkAsReadAsync(alertId);
            return ApiResponse<bool>.Ok(true, "Alert marked as read.");
        }
        catch (Exception)
        {
            return ApiResponse<bool>.Fail("Failed to mark alert as read.");
        }
    }

    public async Task<ApiResponse<bool>> MarkAllAsReadAsync(Guid userId)
    {
        try
        {
            await _alertRepository.MarkAllAsReadAsync(userId);
            return ApiResponse<bool>.Ok(true, "All alerts marked as read.");
        }
        catch (Exception)
        {
            return ApiResponse<bool>.Fail("Failed to mark all alerts as read.");
        }
    }
}
