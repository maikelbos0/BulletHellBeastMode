using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;

namespace BulletHellBeastMode.Api.Account;

public class AccountService(JwtSecurityTokenHandler jwtSecurityTokenHandler, IHttpContextAccessor httpContextAccessor, IOptionsSnapshot<JwtSettings> jwtSettings) : IAccountService {
    private readonly JwtSecurityTokenHandler jwtSecurityTokenHandler = jwtSecurityTokenHandler;
    private readonly IHttpContextAccessor httpContextAccessor = httpContextAccessor;
    private readonly JwtSettings jwtSettings = jwtSettings.Value;

    public void SignIn(string userName, string refreshToken) {
        var accessToken = GenerateAccessToken(userName);

        httpContextAccessor.HttpContext?.Response.Cookies.Append(
            Constants.AccessTokenCookieName,
            accessToken,
            new CookieOptions() { HttpOnly = true, SameSite = SameSiteMode.Strict, Secure = true }
        );

        httpContextAccessor.HttpContext?.Response.Cookies.Append(
            Constants.RefreshTokenCookieName,
            refreshToken,
            new CookieOptions() { HttpOnly = true, SameSite = SameSiteMode.Strict, Secure = true }
        );
    }

    public string GenerateAccessToken(string userName) {
        var signingCredentials = new SigningCredentials(new SymmetricSecurityKey(jwtSettings.SecurityKey), SecurityAlgorithms.HmacSha256);
        var now = DateTime.UtcNow;

        var token = new JwtSecurityToken(
            issuer: jwtSettings.ValidIssuer,
            audience: jwtSettings.ValidAudience,
            claims: new List<Claim>()
            {
                new(JwtRegisteredClaimNames.Sub, userName)
            },
            notBefore: now,
            expires: now.AddSeconds(jwtSettings.AccessTokenExpiresInSeconds),
            signingCredentials: signingCredentials
        );

        return jwtSecurityTokenHandler.WriteToken(token);
    }

    public RefreshTokenDetails GenerateRefreshToken()
        => new(Convert.ToBase64String(RandomNumberGenerator.GetBytes(384)), DateTimeOffset.UtcNow.AddSeconds(jwtSettings.RefreshTokenExpiresInSeconds));

    public AccountDetails GetAcccountDetails() {
        var identity = httpContextAccessor.HttpContext?.User.Identity;

        return new AccountDetails(identity?.Name, identity?.Name);
    }

    public string? GetRefreshToken()
        => httpContextAccessor.HttpContext?.Request.Cookies[Constants.RefreshTokenCookieName];

    public void SignOut() {
        httpContextAccessor.HttpContext?.Response.Cookies.Delete(Constants.AccessTokenCookieName);
        httpContextAccessor.HttpContext?.Response.Cookies.Delete(Constants.RefreshTokenCookieName);
    }
}
