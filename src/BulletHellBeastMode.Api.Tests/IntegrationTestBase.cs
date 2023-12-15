using BulletHellBeastMode.Api.Database;
using BulletHellBeastMode.Api.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing.Handlers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using System;
using System.Linq;
using System.Net;
using System.Net.Http;
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

    public async Task<User> CreateSignedInUser(string userName, bool useOldAlgorithm = false, DateTime? accessTokenExpires = null, DateTime? refreshTokenExpires = null) {
        var user = await CreateUser(userName, useOldAlgorithm);

        SetAccessToken(userName, accessTokenExpires);
        SetRefreshToken(await CreateRefreshToken(userName, refreshTokenExpires));

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

    public void SetAccessToken(string userName, DateTime? expires = null) {
        var jwtSecurityTokenProvider = factory.Services.GetRequiredService<JwtSecurityTokenProvider>();
        var accessToken = jwtSecurityTokenProvider.Provide(userName, DateTime.MinValue, expires ?? DateTime.MaxValue);

        cookieContainer.Add(new(BaseAddress), new Cookie(Constants.AccessTokenCookieName, HttpUtility.UrlEncode(accessToken)));
    }

    public async Task<string> CreateRefreshToken(string userName, DateTime? expires = null) {
        var refreshToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(384));

        await ExecuteOnContext(async context => {
            var user = await context.Users.AsTracking().SingleAsync(user => user.Name == userName);

            user.RefreshTokenFamilies.Add(new RefreshTokenFamily() {
                Token = new PasswordHasher<User>().HashPassword(user, refreshToken),
                Expires = expires ?? DateTime.MaxValue
            });
            await context.SaveChangesAsync();
        });

        return refreshToken;
    }

    public bool HasRefreshToken()
        => cookieContainer.GetAllCookies().Any(cookie => cookie.Name == Constants.RefreshTokenCookieName);

    public string GetRefreshToken()
        => HttpUtility.UrlDecode(cookieContainer.GetAllCookies().Single(cookie => cookie.Name == Constants.RefreshTokenCookieName).Value);

    public void SetRefreshToken(string refreshToken)
        => cookieContainer.Add(new(BaseAddress), new Cookie(Constants.RefreshTokenCookieName, HttpUtility.UrlEncode(refreshToken)));

    public async Task ExecuteOnContext(Func<BulletHellContext, Task> contextAction) {
        using var scope = factory.Services.CreateScope();
        using var context = scope.ServiceProvider.GetRequiredService<BulletHellContext>();

        await contextAction(context);
    }

    public void Dispose() {
        Client?.Dispose();
        GC.SuppressFinalize(this);
    }
}
