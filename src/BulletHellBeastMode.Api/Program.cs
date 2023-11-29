using BulletHellBeastMode.Api;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;

const string tokenCookieName = "X-Jwt-Token";

var builder = WebApplication.CreateBuilder(args);
var appSettings = builder.Configuration.Get<AppSettings>()
    ?? throw new InvalidOperationException($"Configuration section '{nameof(AppSettings)}' was not found");
var jwtSettings = builder.Configuration.GetSection(nameof(JwtSettings)).Get<JwtSettings>()
    ?? throw new InvalidOperationException($"Configuration section '{nameof(JwtSettings)}' was not found");

if (appSettings.ClientUri != null) {
    builder.Services.AddCors(options => options.AddDefaultPolicy(policy => policy.WithOrigins(appSettings.ClientUri)));
}

jwtSettings.SecurityKey ??= RandomNumberGenerator.GetBytes(32);

builder.Services.AddAuthentication().AddJwtBearer(options => {
    options.MapInboundClaims = false;

    options.TokenValidationParameters = new TokenValidationParameters() {
        RequireAudience = jwtSettings.ValidAudience != null,
        ValidateAudience = jwtSettings.ValidAudience != null,
        ValidAudience = jwtSettings.ValidAudience,
        ValidateIssuer = jwtSettings.ValidIssuer != null,
        ValidIssuer = jwtSettings.ValidIssuer,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(jwtSettings.SecurityKey),
        RequireExpirationTime = true,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.FromSeconds(30),
        NameClaimType = JwtRegisteredClaimNames.Sub
    };
    
    options.Events = new JwtBearerEvents {
        OnMessageReceived = context =>
        {
            context.Token = context.Request.Cookies[tokenCookieName];
            return Task.CompletedTask;
        }
    };
});
builder.Services.AddAuthorization();

builder.Services.AddSingleton(jwtSettings);

builder.Services.AddScoped<JwtSecurityTokenHandler>();
builder.Services.AddScoped<JwtTokenGenerator>();

var app = builder.Build();

app.UseHttpsRedirection();

if (appSettings.ClientUri != null) {
    app.UseCors();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/test", () => new { Text = "Hello World" });
app.MapPost("/login", (string userName, HttpContext httpContext, JwtTokenGenerator jwtTokenGenerator) => {
    var jwtToken = jwtTokenGenerator.GenerateToken(userName);
    
    httpContext.Response.Cookies.Append("X-Access-Token", jwtToken, new CookieOptions() { HttpOnly = true, SameSite = SameSiteMode.Strict, Secure = true });

    return Results.NoContent();
});
app.MapPost("/logout", (HttpContext httpContext) => {
    httpContext.Response.Cookies.Delete("X-Access-Token");

    return Results.NoContent();
});

app.Run();
