using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace BulletHellBeastMode.Api.Account
{
    public interface IAccountService
    {
        void SignIn(string userName);
    }

    public class AccountService : IAccountService
    {
        private readonly JwtSecurityTokenHandler jwtSecurityTokenHandler;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly JwtSettings jwtSettings;

        public AccountService(JwtSecurityTokenHandler jwtSecurityTokenHandler, IHttpContextAccessor httpContextAccessor, IOptionsSnapshot<JwtSettings> jwtSettings)
        {
            this.jwtSecurityTokenHandler = jwtSecurityTokenHandler;
            this.httpContextAccessor = httpContextAccessor;
            this.jwtSettings = jwtSettings.Value;
        }

        public void SignIn(string userName)
        {
            var token = GenerateToken(userName);
            
            httpContextAccessor.HttpContext?.Response.Cookies.Append(
                Constants.AccessTokenCookieName,
                token,
                new CookieOptions() { HttpOnly = true, SameSite = SameSiteMode.Strict, Secure = true }
            );
        }

        private string GenerateToken(string userName)
        {
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
    }
}
