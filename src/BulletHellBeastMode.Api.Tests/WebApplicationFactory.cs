using BulletHellBeastMode.Api.Database;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using System.Threading.Tasks;
using Testcontainers.MsSql;
using Xunit;

namespace BulletHellBeastMode.Api.Tests;

public class WebApplicationFactory : WebApplicationFactory<AppSettings>, IAsyncLifetime {
    private readonly MsSqlContainer databaseContainer = new MsSqlBuilder()
        .Build();

    protected override void ConfigureWebHost(IWebHostBuilder builder) {
        builder.ConfigureTestServices(services => {
            services.RemoveAll<DbContextOptions<BulletHellContext>>();
            services.AddDbContext<BulletHellContext>(options => options
                .UseSqlServer(databaseContainer.GetConnectionString())
                .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking));
        });
    }

    public Task InitializeAsync() {
        return databaseContainer.StartAsync();
    }

    public new Task DisposeAsync() {
        return databaseContainer.StopAsync();
    }
}
