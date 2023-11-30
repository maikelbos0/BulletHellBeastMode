using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

namespace BulletHellBeastMode.Api;

public class ConfigureJwtBearerOptions : IConfigureNamedOptions<JwtBearerOptions> {
    private readonly IOptionsMonitor<JwtSettings> jwtSettings;

    public ConfigureJwtBearerOptions(IOptionsMonitor<JwtSettings> jwtSettings)
    {
        this.jwtSettings = jwtSettings;
    }

    public void Configure(string? name, JwtBearerOptions options) {
        Configure(options);
    }

    public void Configure(JwtBearerOptions options) {
        options.MapInboundClaims = false;

        options.TokenValidationParameters = new TokenValidationParameters() {
            ValidAudience = jwtSettings.CurrentValue.ValidAudience,
            ValidIssuer = jwtSettings.CurrentValue.ValidIssuer,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(jwtSettings.CurrentValue.SecurityKey),
            NameClaimType = JwtRegisteredClaimNames.Sub
        };

        options.Events = new JwtBearerEvents {
            OnMessageReceived = context =>
            {
                context.Token ??= context.Request.Cookies[Constants.AccessTokenCookieName];
                return Task.CompletedTask;
            },
            OnAuthenticationFailed = context => 
            {
                //context.
                return Task.CompletedTask;
            }
        };
    }
}
