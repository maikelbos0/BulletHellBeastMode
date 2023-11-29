using BulletHellBeastMode.Api;
using System.IdentityModel.Tokens.Jwt;

var builder = WebApplication.CreateBuilder(args);
var corsOrigin = builder.Configuration["CorsOrigin"];

if (corsOrigin != null) {
    builder.Services.AddCors(options => options.AddDefaultPolicy(policy => policy.WithOrigins(corsOrigin)));
}

builder.Services.AddAuthentication().AddJwtBearer();
builder.Services.ConfigureOptions<ConfigureJwtBearerOptions>();
builder.Services.AddAuthorization();
builder.Services.AddOptions<JwtSettings>().Bind(builder.Configuration.GetSection(nameof(JwtSettings)));
builder.Services.AddScoped<JwtSecurityTokenHandler>();
builder.Services.AddScoped<JwtTokenGenerator>();

var app = builder.Build();

app.UseHttpsRedirection();

if (corsOrigin != null) {
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
