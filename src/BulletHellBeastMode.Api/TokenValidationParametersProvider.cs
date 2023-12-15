using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

namespace BulletHellBeastMode.Api;

public class TokenValidationParametersProvider(IOptionsMonitor<JwtSettings> jwtSettings) {
    public TokenValidationParameters Provide(bool validateLifetime) => new() {
        ValidAudience = jwtSettings.CurrentValue.ValidAudience,
        ValidIssuer = jwtSettings.CurrentValue.ValidIssuer,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(jwtSettings.CurrentValue.SecurityKey),
        NameClaimType = JwtRegisteredClaimNames.Sub,
        ValidateLifetime = validateLifetime
    };
}
