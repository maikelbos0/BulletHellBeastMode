using BulletHellBeastMode.Api.Database;
using BulletHellBeastMode.Api.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing.Handlers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;
using System.Web;
using Xunit;

namespace BulletHellBeastMode.Api.Tests;

public abstract class IntegrationTestBase : IClassFixture<WebApplicationFactory>, IDisposable {
    public const string BaseAddress = "https://localhost";

    private readonly WebApplicationFactory factory;
    private readonly CookieContainer cookieContainer;

    public HttpClient Client { get; }

    protected IntegrationTestBase(WebApplicationFactory factory) {
        this.factory = factory;

        Client = factory.CreateDefaultClient(
            new Uri(BaseAddress),
            new CookieContainerHandler(cookieContainer = new())
        );

        using var scope = factory.Services.CreateScope();
        using var context = scope.ServiceProvider.GetRequiredService<BulletHellContext>();
        context.Database.EnsureCreated();
    }

    [Obsolete]
    public UserBuilder CreateUserOld(string userName) => new(factory, cookieContainer, userName);

    [Obsolete]
    public string GetCookie(string name) => HttpUtility.UrlDecode(cookieContainer.GetAllCookies().Single(cookie => cookie.Name == name).Value);

    [Obsolete]
    public void SetCookie(string name, string value) {
        RemoveCookie(name);
        cookieContainer.Add(new(BaseAddress), new Cookie(name, HttpUtility.UrlEncode(value)));
    }

    [Obsolete]
    public void RemoveCookie(string name) {
        foreach (var cookie in cookieContainer.GetAllCookies().Where(cookie => cookie.Name == name)) {
            cookie.Expired = true;
        }
    }

    public async Task<User> CreateSignedInUser(string userName, bool useOldAlgorithm = false, DateTime? accessTokenExpires = null, DateTime? refreshTokenExpires = null) {
        var user = await CreateUser(userName, useOldAlgorithm);

        SetAccessToken(userName, accessTokenExpires ?? DateTime.MaxValue);
        SetRefreshToken(await CreateRefreshToken(userName, refreshTokenExpires ?? DateTime.MaxValue));

        return user;
    }

    public async Task<User> CreateUser(string userName, bool useOldAlgorithm = false) {
        var user = new User() { Name = userName };
        var passwordHasher = useOldAlgorithm
            ? new PasswordHasher<User>(Options.Create(new PasswordHasherOptions() { CompatibilityMode = PasswordHasherCompatibilityMode.IdentityV2 }))
            : new PasswordHasher<User>();

        user.Password = passwordHasher.HashPassword(user, "password");
        await ExecuteOnContext(async context => {
            await context.Users.AddAsync(user);
            await context.SaveChangesAsync();
        });

        return user;
    }

    public string GetAccessToken()
        => HttpUtility.UrlDecode(cookieContainer.GetAllCookies().Single(cookie => cookie.Name == Constants.AccessTokenCookieName).Value);

    public void SetAccessToken(string userName, DateTime expires) {
        var jwtSettings = factory.Services.GetRequiredService<IOptions<JwtSettings>>().Value;
        var jwtSecurityTokenHandler = factory.Services.GetRequiredService<JwtSecurityTokenHandler>();
        // TODO unify this also with jwt config?
        var signingCredentials = new SigningCredentials(new SymmetricSecurityKey(jwtSettings.SecurityKey), SecurityAlgorithms.HmacSha256);
        var accessToken = new JwtSecurityToken(
            issuer: jwtSettings.ValidIssuer,
            audience: jwtSettings.ValidAudience,
            claims: new List<Claim>() {
                new(JwtRegisteredClaimNames.Sub, userName)
            },
            notBefore: DateTime.MinValue,
            expires: expires,
            signingCredentials: signingCredentials
        );

        cookieContainer.Add(new(BaseAddress), new Cookie(Constants.AccessTokenCookieName, HttpUtility.UrlEncode(jwtSecurityTokenHandler.WriteToken(accessToken))));
    }

    public async Task<string> CreateRefreshToken(string userName, DateTime expires) {
        var refreshToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(384));

        await ExecuteOnContext(async context => {
            var user = await context.Users.AsTracking().SingleAsync(user => user.Name == userName);

            user.RefreshTokenFamilies.Add(new RefreshTokenFamily() {
                Token = new PasswordHasher<User>().HashPassword(user, refreshToken),
                Expires = expires
            });
            await context.SaveChangesAsync();
        });

        return refreshToken;
    }

    public string GetRefreshToken() 
        => HttpUtility.UrlDecode(cookieContainer.GetAllCookies().Single(cookie => cookie.Name == Constants.RefreshTokenCookieName).Value);

    public void SetRefreshToken(string refreshToken)
        => cookieContainer.Add(new(BaseAddress), new Cookie(Constants.RefreshTokenCookieName, HttpUtility.UrlEncode(refreshToken)));

    public async Task ExecuteOnContext(Func<BulletHellContext, Task> contextAction) {
        using var scope = factory.Services.CreateScope();
        using var context = scope.ServiceProvider.GetRequiredService<BulletHellContext>();

        await contextAction(context);
    }

    [Obsolete]
    public TService GetService<TService>() where TService : class
        => factory.Services.GetRequiredService<TService>();

    [Obsolete]
    public BulletHellContextProvider CreateContextProvider() => new(factory);

    public void Dispose() {
        Client?.Dispose();
        GC.SuppressFinalize(this);
    }
}
