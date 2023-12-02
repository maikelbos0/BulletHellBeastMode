using BulletHellBeastMode.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace BulletHellBeastMode.Api.Database;

public class BulletHellContext : DbContext {
    public DbSet<User> Users => Set<User>();

    public BulletHellContext(DbContextOptions<BulletHellContext> options) : base(options) { }
}
