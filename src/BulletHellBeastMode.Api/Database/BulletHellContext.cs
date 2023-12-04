using BulletHellBeastMode.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace BulletHellBeastMode.Api.Database;

public class BulletHellContext : DbContext {
    public DbSet<User> Users => Set<User>();

    public BulletHellContext(DbContextOptions<BulletHellContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder) {
        base.OnModelCreating(modelBuilder);

        var userEntity = modelBuilder.Entity<User>();
        userEntity.HasIndex(user => user.Name).IsUnique();
        userEntity.HasMany(user => user.Events).WithOne().IsRequired();
    }
}
