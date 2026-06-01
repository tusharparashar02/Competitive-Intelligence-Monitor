using Backend.Models.DTOs.Requests;
using Backend.Models.DTOs.Responses;

namespace Backend.BusinessLayer.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task<UserResponse> GetCurrentUserAsync(Guid userId);
}
