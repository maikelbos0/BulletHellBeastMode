﻿using BulletHellBeastMode.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace BulletHellBeastMode.Api.Database;

public class BulletHellContext(DbContextOptions<BulletHellContext> options) : DbContext(options) {
    public DbSet<User> Users => Set<User>();
    public DbSet<UserEvent> UserEvents => Set<UserEvent>();
    public DbSet<RefreshTokenFamily> RefreshTokenFamilies => Set<RefreshTokenFamily>();
    public DbSet<UsedRefreshToken> UsedRefreshTokens => Set<UsedRefreshToken>();

    protected override void OnModelCreating(ModelBuilder modelBuilder) {
        base.OnModelCreating(modelBuilder);

        var userEntity = modelBuilder.Entity<User>();
        userEntity.HasIndex(user => user.Name).IsUnique();
        userEntity.HasMany(user => user.Events).WithOne().IsRequired();
    }
}
