using BulletHellBeastMode.Api.Account;
using BulletHellBeastMode.Api.Database;
using Microsoft.AspNetCore.Mvc.Testing.Handlers;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using Xunit;

namespace BulletHellBeastMode.Api.Tests;

public abstract class IntegrationTestBase : IClassFixture<WebApplicationFactory>, IDisposable {
    private readonly WebApplicationFactory factory;
    private readonly CookieContainer cookieContainer;

    public HttpClient Client { get; }

    protected IntegrationTestBase(WebApplicationFactory factory) {
        this.factory = factory;

        Client = factory.CreateDefaultClient(
            new Uri("https://localhost"),
            new CookieContainerHandler(cookieContainer = new())
        );

        using var scope = factory.Services.CreateScope();
        using var context = scope.ServiceProvider.GetRequiredService<BulletHellContext>();
        context.Database.EnsureCreated();
    }

    public void AuthenticateClient(string userName) {
        using var scope = factory.Services.CreateScope();
        var token = scope.ServiceProvider.GetRequiredService<IAccountService>().GenerateAccessToken(userName);
        cookieContainer.Add(new("https://localhost"), new Cookie(Constants.AccessTokenCookieName, token));
    }

    public string GetCookie(string name) => HttpUtility.UrlDecode(cookieContainer.GetAllCookies().Single(cookie => cookie.Name == name).Value);

    public void SetCookie(string name, string value) {
        RemoveCookie(name);
        cookieContainer.Add(new("https://localhost"), new Cookie(name, HttpUtility.UrlEncode(value)));
    }

    public void RemoveCookie(string name) {
        foreach (var cookie in cookieContainer.GetAllCookies().Where(cookie => cookie.Name == name)) {
            cookie.Expired = true;
        }
    }

    public TService GetService<TService>() where TService : class
        => factory.Services.GetRequiredService<TService>();

    public BulletHellContextProvider CreateContextProvider() => new(factory);

    public void Dispose() {
        Client?.Dispose();
        GC.SuppressFinalize(this);
    }
}
