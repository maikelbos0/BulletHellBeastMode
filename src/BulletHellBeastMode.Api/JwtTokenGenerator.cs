using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace BulletHellBeastMode.Api;

public class JwtTokenGenerator {
    private readonly JwtSecurityTokenHandler jwtSecurityTokenHandler;
    private readonly JwtSettings jwtSettings;

    public JwtTokenGenerator(JwtSecurityTokenHandler jwtSecurityTokenHandler, JwtSettings jwtSettings) {
        this.jwtSecurityTokenHandler = jwtSecurityTokenHandler;
        this.jwtSettings = jwtSettings;
    }

    public string GenerateToken(string userName) {
        var signingCredentials = new SigningCredentials(new SymmetricSecurityKey(jwtSettings.SecurityKey), SecurityAlgorithms.HmacSha256);
        var now = DateTime.UtcNow;
        
        var token = new JwtSecurityToken(
            issuer: jwtSettings.ValidIssuer,
            audience: jwtSettings.ValidAudience,
            claims: new List<Claim>()
            {
                new Claim(JwtRegisteredClaimNames.Sub, userName)
            },
            notBefore: now,
            expires: now.AddSeconds(jwtSettings.ExpiresInSeconds),
            signingCredentials: signingCredentials
        );

        return jwtSecurityTokenHandler.WriteToken(token);
    }
}
