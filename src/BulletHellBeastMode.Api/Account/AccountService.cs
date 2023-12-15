using Microsoft.Extensions.Options;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;

namespace BulletHellBeastMode.Api.Account;

public class AccountService(
    TokenValidationParametersProvider tokenValidationParametersProvider,
    JwtSecurityTokenProvider jwtSecurityTokenProvider,
    JwtSecurityTokenHandler jwtSecurityTokenHandler, 
    IHttpContextAccessor httpContextAccessor, 
    IOptionsSnapshot<JwtSettings> jwtSettings
) {
    private readonly JwtSettings jwtSettings = jwtSettings.Value;

    public void SignIn(string userName, string refreshToken) {
        var accessToken = jwtSecurityTokenProvider.Provide(userName);

        // TODO refresh token cookie expiration, access token cookie expiration maybe?

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

    public RefreshTokenDetails GenerateRefreshToken()
        => new(Convert.ToBase64String(RandomNumberGenerator.GetBytes(384)), DateTimeOffset.UtcNow.AddSeconds(jwtSettings.RefreshTokenExpiresInSeconds));

    public string? GetUserName(bool allowExpiredToken) {
        return httpContextAccessor.HttpContext?.User.Identity?.Name
            ?? GetUserNameFromExpiredAccessToken();

        string? GetUserNameFromExpiredAccessToken() {
            var accessToken = httpContextAccessor.HttpContext?.Request.Cookies[Constants.AccessTokenCookieName];

            if (!allowExpiredToken || accessToken == null) {
                return null;
            }

            jwtSecurityTokenHandler.ValidateToken(accessToken, tokenValidationParametersProvider.Provide(validateLifetime: false), out var securityToken);

            return (securityToken as JwtSecurityToken)?.Subject;
        }
    }

    // TODO replace calls for username with GetUserName
    public AccountDetails GetAcccountDetails() {
        var identity = httpContextAccessor.HttpContext?.User.Identity;

        // TODO add display name
        return new AccountDetails(identity?.Name, identity?.Name);
    }

    public string? GetRefreshToken()
        => httpContextAccessor.HttpContext?.Request.Cookies[Constants.RefreshTokenCookieName];

    public void SignOut() {
        httpContextAccessor.HttpContext?.Response.Cookies.Delete(Constants.AccessTokenCookieName);
        httpContextAccessor.HttpContext?.Response.Cookies.Delete(Constants.RefreshTokenCookieName);
    }
}
