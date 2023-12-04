using BulletHellBeastMode.Api.Database;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Net.Http;
using Xunit;

namespace BulletHellBeastMode.Api.Tests;

public abstract class IntegrationTestBase : IClassFixture<WebApplicationFactory>, IDisposable {
    private readonly WebApplicationFactory factory;

    protected HttpClient Client { get; }

    protected IntegrationTestBase(WebApplicationFactory factory) {
        this.factory = factory;

        Client = factory.CreateClient(new() {
            BaseAddress = new("https://localhost")
        });

        using var scope = factory.Services.CreateScope();
        using var context = scope.ServiceProvider.GetRequiredService<BulletHellContext>();
        context.Database.EnsureCreated();
    }

    public BulletHellContextProvider CreateContextProvider() => new BulletHellContextProvider(factory);

    public void Dispose() {
        Client?.Dispose();
        GC.SuppressFinalize(this);
    }
}
