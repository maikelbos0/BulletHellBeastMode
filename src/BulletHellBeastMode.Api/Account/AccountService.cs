using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace BulletHellBeastMode.Api.Account;

public class AccountService(JwtSecurityTokenHandler jwtSecurityTokenHandler, IHttpContextAccessor httpContextAccessor, IOptionsSnapshot<JwtSettings> jwtSettings) : IAccountService {
    private readonly JwtSecurityTokenHandler jwtSecurityTokenHandler = jwtSecurityTokenHandler;
    private readonly IHttpContextAccessor httpContextAccessor = httpContextAccessor;
    private readonly JwtSettings jwtSettings = jwtSettings.Value;

    public void SignIn(string userName) {
        var token = GenerateToken(userName);

        httpContextAccessor.HttpContext?.Response.Cookies.Append(
            Constants.AccessTokenCookieName,
            token,
            new CookieOptions() { HttpOnly = true, SameSite = SameSiteMode.Strict, Secure = true }
        );
    }

    private string GenerateToken(string userName) {
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
            expires: now.AddSeconds(jwtSettings.ExpiresInSeconds),
            signingCredentials: signingCredentials
        );

        return jwtSecurityTokenHandler.WriteToken(token);
    }

    public AccountDetails GetAcccountDetails() {
        var identity = httpContextAccessor.HttpContext?.User.Identity;

        return new AccountDetails(identity?.Name, identity?.Name);
    }
}
