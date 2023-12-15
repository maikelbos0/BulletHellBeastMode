using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace BulletHellBeastMode.Api;

public class JwtSecurityTokenProvider(IOptionsMonitor<JwtSettings> jwtSettings, JwtSecurityTokenHandler jwtSecurityTokenHandler) {
    public string Provide(string userName) {
        var now = DateTime.UtcNow;

        return Provide(userName, now, now.AddSeconds(jwtSettings.CurrentValue.AccessTokenExpiresInSeconds));
    }

    public string Provide(string userName, DateTime notBefore, DateTime expires) {
        var signingCredentials = new SigningCredentials(new SymmetricSecurityKey(jwtSettings.CurrentValue.SecurityKey), SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer: jwtSettings.CurrentValue.ValidIssuer,
            audience: jwtSettings.CurrentValue.ValidAudience,
            claims: new List<Claim>()
            {
                new (JwtRegisteredClaimNames.Sub, userName)
            },
            notBefore: notBefore,
            expires: expires,
            signingCredentials: signingCredentials
        );

        return jwtSecurityTokenHandler.WriteToken(token);
    }
}
