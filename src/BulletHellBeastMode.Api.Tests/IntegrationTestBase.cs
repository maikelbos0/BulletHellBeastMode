using BulletHellBeastMode.Api.Database;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Net.Http;
using Xunit;

namespace BulletHellBeastMode.Api.Tests;

public abstract class IntegrationTestBase : IClassFixture<WebApplicationFactory>, IDisposable {
    private IServiceScope scope;

    protected BulletHellContext Context { get; }
    protected HttpClient Client { get; }

    protected IntegrationTestBase(WebApplicationFactory factory) {
        scope = factory.Services.CreateScope();

        Context = scope.ServiceProvider.GetRequiredService<BulletHellContext>();
        Context.Database.EnsureCreated();
        Client = factory.CreateClient(new() {
            BaseAddress = new("https://localhost")
        });
    }

    public void Dispose() {
        Client?.Dispose();
        Context?.Dispose();

        scope?.Dispose();
    }
}
