using BulletHellBeastMode.Api.Database;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace BulletHellBeastMode.Api.Tests;

public class BulletHellContextProvider : IDisposable {
    private readonly IServiceScope scope;

    public BulletHellContext Context { get; }

    public BulletHellContextProvider(WebApplicationFactory factory) {
        scope = factory.Services.CreateScope();
        Context = scope.ServiceProvider.GetRequiredService<BulletHellContext>();
    }

    public void Dispose() {
        Context?.Dispose();
        scope?.Dispose();
        GC.SuppressFinalize(this);
    }
}
