using BulletHellBeastMode.Api;
using System.Security.Cryptography;

var builder = WebApplication.CreateBuilder(args);
var appSettings = builder.Configuration.Get<AppSettings>()
    ?? throw new InvalidOperationException($"Configuration section '{nameof(AppSettings)}' was not found");

if (appSettings.ClientUri != null) {
    builder.Services.AddCors(options => options.AddDefaultPolicy(policy => policy.WithOrigins(appSettings.ClientUri)));
}

builder.Services.AddOptions<JwtSettings>()
    .Bind(builder.Configuration.GetRequiredSection(nameof(JwtSettings)))
    .Configure(jwtSettings => jwtSettings.SecurityKey ??= RandomNumberGenerator.GetBytes(32));

builder.Services.AddScoped<JwtSecurityTokenHandler>();
builder.Services.AddScoped<JwtTokenGenerator>();

var app = builder.Build();

app.UseHttpsRedirection();

if (appSettings.ClientUri != null) {
    app.UseCors();
}

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
