using Backend.Models.DTOs.Responses;

namespace Backend.BusinessLayer.Interfaces;

public interface IAlertService
{
    Task<ApiResponse<IEnumerable<AlertResponse>>> GetAlertsAsync(Guid userId, bool unreadOnly);
    Task<ApiResponse<int>> GetUnreadCountAsync(Guid userId);
    Task<ApiResponse<bool>> MarkAsReadAsync(Guid alertId, Guid userId);
    Task<ApiResponse<bool>> MarkAllAsReadAsync(Guid userId);
}
