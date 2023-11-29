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

app.MapGet("/account", (HttpContext httpContext) => {
    var identity = httpContext.User.Identity
        ?? throw new InvalidOperationException("Request was authorized but identity was not found");

    return new {
        IsAuthenticated = true,
        UserName = identity.Name,
        DisplayName = identity.Name
    };
}).RequireAuthorization();

app.MapPost("/account/login", (LoginRequest loginRequest, HttpContext httpContext, JwtTokenGenerator jwtTokenGenerator) => {
    var jwtToken = jwtTokenGenerator.GenerateToken(loginRequest.UserName);

    httpContext.Response.Cookies.Append(Constants.AccessTokenCookieName, jwtToken, new CookieOptions() { HttpOnly = true, SameSite = SameSiteMode.Strict, Secure = true });

    return Results.Redirect("/account");
});

app.MapPost("/account/logout", (HttpContext httpContext) => {
    httpContext.Response.Cookies.Delete(Constants.AccessTokenCookieName);

    return Results.NoContent();
});

app.Run();
