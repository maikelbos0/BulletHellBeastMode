using BulletHellBeastMode.Api.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace BulletHellBeastMode.Api.Database;

public class BulletHellContext : DbContext {
    public DbSet<User> Users => Set<User>();

    public BulletHellContext(IOptionsSnapshot<AppSettings> appSettings)
        : base(new DbContextOptionsBuilder<BulletHellContext>()
              .UseSqlServer(appSettings.Value.ConnectionString)
              .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking).Options) { }
}
