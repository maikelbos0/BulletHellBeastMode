using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;

namespace BulletHellBeastMode.Api;

public class ConfigureJwtBearerOptions(TokenValidationParametersProvider tokenValidationParametersProvider) : IConfigureNamedOptions<JwtBearerOptions> {
    public void Configure(string? name, JwtBearerOptions options) {
        Configure(options);
    }

    public void Configure(JwtBearerOptions options) {
        options.MapInboundClaims = false;

        options.TokenValidationParameters = tokenValidationParametersProvider.Provide(validateLifetime: true);

        options.Events = new JwtBearerEvents {
            OnMessageReceived = context =>
            {
                context.Token = context.Request.Cookies[Constants.AccessTokenCookieName];
                return Task.CompletedTask;
            }
        };
    }
}
