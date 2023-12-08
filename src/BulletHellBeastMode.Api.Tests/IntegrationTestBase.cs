using BulletHellBeastMode.Api.Account;
using BulletHellBeastMode.Api.Database;
using Microsoft.AspNetCore.Mvc.Testing.Handlers;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Net;
using System.Net.Http;
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

    public BulletHellContextProvider CreateContextProvider() => new(factory);

    public void Dispose() {
        Client?.Dispose();
        GC.SuppressFinalize(this);
    }
}
