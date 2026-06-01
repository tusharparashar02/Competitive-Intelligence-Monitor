using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AutoMapper;
using Backend.BusinessLayer.Interfaces;
using Backend.Models.DTOs.Requests;
using Backend.Models.DTOs.Responses;
using Backend.Models.Entities;
using Backend.RepositoryLayer.Interfaces;
using Microsoft.IdentityModel.Tokens;

namespace Backend.BusinessLayer.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;
    private readonly IConfiguration _configuration;

    public AuthService(IUserRepository userRepository, IMapper mapper, IConfiguration configuration)
    {
        _userRepository  = userRepository;
        _mapper          = mapper;
        _configuration   = configuration;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        var emailTaken = await _userRepository.EmailExistsAsync(request.Email);
        if (emailTaken)
            throw new InvalidOperationException("An account with this email already exists.");

        var user = _mapper.Map<User>(request);
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        await _userRepository.AddAsync(user);

        var (token, expiresAt) = GenerateJwtToken(user);

        return new AuthResponse
        {
            Token     = token,
            ExpiresAt = expiresAt,
            User      = _mapper.Map<UserResponse>(user)
        };
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email)
            ?? throw new UnauthorizedAccessException("Invalid email or password.");

        var passwordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
        if (!passwordValid)
            throw new UnauthorizedAccessException("Invalid email or password.");

        var (token, expiresAt) = GenerateJwtToken(user);

        return new AuthResponse
        {
            Token     = token,
            ExpiresAt = expiresAt,
            User      = _mapper.Map<UserResponse>(user)
        };
    }

    public async Task<UserResponse> GetCurrentUserAsync(Guid userId)
    {
        var user = await _userRepository.GetByIdAsync(userId)
            ?? throw new KeyNotFoundException("User not found.");

        return _mapper.Map<UserResponse>(user);
    }

    // ── Private ───────────────────────────────────────────────────────────────

    private (string token, DateTime expiresAt) GenerateJwtToken(User user)
    {
        var secret      = _configuration["JwtSettings:Secret"]!;
        var issuer      = _configuration["JwtSettings:Issuer"]!;
        var audience    = _configuration["JwtSettings:Audience"]!;
        var expiryDays  = int.Parse(_configuration["JwtSettings:ExpiryInDays"] ?? "7");

        var key         = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expiresAt   = DateTime.UtcNow.AddDays(expiryDays);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub,   user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(JwtRegisteredClaimNames.Name,  user.Name),
            new Claim("userId",                      user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti,   Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer:             issuer,
            audience:           audience,
            claims:             claims,
            expires:            expiresAt,
            signingCredentials: credentials
        );

        return (new JwtSecurityTokenHandler().WriteToken(token), expiresAt);
    }
}
