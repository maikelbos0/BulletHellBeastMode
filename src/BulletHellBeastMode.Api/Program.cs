using BulletHellBeastMode.Api;
using BulletHellBeastMode.Api.Account;
using BulletHellBeastMode.Api.Database;
using BulletHellBeastMode.Api.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.IdentityModel.Tokens.Jwt;

var builder = WebApplication.CreateBuilder(args);
var corsOrigin = builder.Configuration["CorsOrigin"];

if (corsOrigin != null) {
    builder.Services.AddCors(options => options.AddDefaultPolicy(policy => policy.WithOrigins(corsOrigin)));
}

builder.Services.AddOptions<JwtSettings>().Bind(builder.Configuration.GetSection(nameof(JwtSettings)));
builder.Services.AddOptions<AppSettings>().Bind(builder.Configuration.GetSection(nameof(AppSettings)));
builder.Services.AddAuthentication().AddJwtBearer();
builder.Services.ConfigureOptions<ConfigureJwtBearerOptions>();
builder.Services.AddAuthorization();
builder.Services.AddTransient<JwtSecurityTokenHandler>();
builder.Services.AddTransient<AccountService>();
builder.Services.AddTransient<PasswordHasher<User>>();
builder.Services.AddSingleton<TokenValidationParametersProvider>();
builder.Services.AddDbContext<BulletHellContext>((serviceProvider, options) => options
    .UseSqlServer(serviceProvider.GetRequiredService<IOptionsSnapshot<AppSettings>>().Value.ConnectionString)
    .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking));
builder.Services.AddHttpContextAccessor();
builder.Services.AddMediatR(configuration => configuration.RegisterServicesFromAssemblyContaining<Program>());

var app = builder.Build();

app.UseHttpsRedirection();

if (corsOrigin != null) {
    app.UseCors();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/test", () => new { Text = "Hello World" });

app.MapGet("/account", async (IMediator mediator) => await mediator.Send(new GetAccountDetailsQuery())).RequireAuthorization();
app.MapPost("/account/refresh-token", async (IMediator mediator) => await mediator.Send(new RefreshAccessTokenCommand()));
app.MapPost("/account/register", async (RegisterUserCommand command, IMediator mediator) => await mediator.Send(command));
app.MapPost("/account/sign-in", async (SignInUserCommand command, IMediator mediator) => await mediator.Send(command));
app.MapPost("/account/sign-out", async (IMediator mediator) => await mediator.Send(new SignOutUserCommand())).RequireAuthorization();

app.Run();
