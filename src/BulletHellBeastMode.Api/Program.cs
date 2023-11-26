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
    .Configure(jwtSettings => {
        if (jwtSettings.SecurityKey == null) {
            jwtSettings.SecurityKey = RandomNumberGenerator.GetBytes(32);
        }
    });

var app = builder.Build();

app.UseHttpsRedirection();

if (appSettings.ClientUri != null) {
    app.UseCors();
}

app.MapGet("/test", () => new { Text = "Hello World" });

app.Run();
