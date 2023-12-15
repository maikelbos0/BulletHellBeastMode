using BulletHellBeastMode.Api.Entities;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using System.Net.Http.Json;
using System.Net;
using Xunit;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System;

namespace BulletHellBeastMode.Api.Tests.Account;

public class RefreshTokenTests(WebApplicationFactory factory) : IntegrationTestBase(factory) {
    [Fact]
    public async Task RefreshToken_Succeeds() {
        await CreateSignedInUser("refresh-user");

        var originalAccessToken = GetAccessToken();
        var originalRefreshToken = GetRefreshToken();

        var response = await Client.PostAsync("/account/refresh-token", null);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.True((await response.Content.ReadFromJsonAsync<CommandResult>())?.IsSuccess);
        Assert.True(HasRefreshToken());

        Assert.NotEqual(originalAccessToken, GetAccessToken());
        Assert.NotEqual(originalRefreshToken, GetRefreshToken());

        await ExecuteOnContext(async context => {
            var user = await context.Users
                .Include(user => user.Events)
                .Include(user => user.RefreshTokenFamilies).ThenInclude(family => family.UsedRefreshTokens)
                .SingleAsync(user => user.Name == "refresh-user");
            Assert.Equal(UserEventType.AccessTokenRefreshed, Assert.Single(user.Events).Type);
            var passwordHasher = new PasswordHasher<User>();
            var refreshTokenFamily = Assert.Single(user.RefreshTokenFamilies);
            Assert.NotEqual(PasswordVerificationResult.Failed, passwordHasher.VerifyHashedPassword(user, refreshTokenFamily.Token, GetRefreshToken()));
            Assert.NotEqual(PasswordVerificationResult.Failed, passwordHasher.VerifyHashedPassword(user, Assert.Single(refreshTokenFamily.UsedRefreshTokens).Token, originalRefreshToken));
        });

        Assert.Equal(HttpStatusCode.OK, (await Client.GetAsync("/account")).StatusCode);
    }

    [Fact]
    public async Task RefreshToken_Succeeds_With_Expired_AccessToken() {
        await CreateSignedInUser("expired-access-refresh-user", accessTokenExpires: DateTime.UtcNow.AddSeconds(-1));

        var originalAccessToken = GetAccessToken();
        var originalRefreshToken = GetRefreshToken();

        var response = await Client.PostAsync("/account/refresh-token", null);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.True((await response.Content.ReadFromJsonAsync<CommandResult>())?.IsSuccess);
        Assert.True(HasRefreshToken());

        Assert.NotEqual(originalAccessToken, GetAccessToken());
        Assert.NotEqual(originalRefreshToken, GetRefreshToken());

        await ExecuteOnContext(async context => {
            var user = await context.Users
                .Include(user => user.Events)
                .Include(user => user.RefreshTokenFamilies).ThenInclude(family => family.UsedRefreshTokens)
                .SingleAsync(user => user.Name == "expired-access-refresh-user");
            Assert.Equal(UserEventType.AccessTokenRefreshed, Assert.Single(user.Events).Type);
            var passwordHasher = new PasswordHasher<User>();
            var refreshTokenFamily = Assert.Single(user.RefreshTokenFamilies);
            Assert.NotEqual(PasswordVerificationResult.Failed, passwordHasher.VerifyHashedPassword(user, refreshTokenFamily.Token, GetRefreshToken()));
            Assert.NotEqual(PasswordVerificationResult.Failed, passwordHasher.VerifyHashedPassword(user, Assert.Single(refreshTokenFamily.UsedRefreshTokens).Token, originalRefreshToken));
        });

        Assert.Equal(HttpStatusCode.OK, (await Client.GetAsync("/account")).StatusCode);
    }

    [Fact]
    public async Task RefreshToken_Fails_Without_AccessToken() {
        await CreateUser("no-access-refresh-user");
        SetRefreshToken(await CreateRefreshToken("no-access-refresh-user"));

        var response = await Client.PostAsync("/account/refresh-token", null);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.False((await response.Content.ReadFromJsonAsync<CommandResult>())?.IsSuccess);
        Assert.False(HasRefreshToken());

        Assert.Equal(HttpStatusCode.Unauthorized, (await Client.GetAsync("/account")).StatusCode);
    }

    [Fact]
    public async Task RefreshToken_Fails_Without_RefreshToken() {
        await CreateUser("no-refresh-refresh-user");
        SetAccessToken("no-refresh-refresh-user");
        await CreateRefreshToken("no-refresh-refresh-user");

        var response = await Client.PostAsync("/account/refresh-token", null);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.False((await response.Content.ReadFromJsonAsync<CommandResult>())?.IsSuccess);
        Assert.False(HasRefreshToken());

        await ExecuteOnContext(async context => {
            var user = await context.Users
                .Include(user => user.Events)
                .Include(user => user.RefreshTokenFamilies).ThenInclude(family => family.UsedRefreshTokens)
                .SingleAsync(user => user.Name == "no-refresh-refresh-user");
            Assert.Equal(UserEventType.RefreshAccessTokenFailed, Assert.Single(user.Events).Type);
            var refreshTokenFamily = Assert.Single(user.RefreshTokenFamilies);
            Assert.Empty(refreshTokenFamily.UsedRefreshTokens);
        });

        Assert.Equal(HttpStatusCode.Unauthorized, (await Client.GetAsync("/account")).StatusCode);
    }

    [Fact]
    public async Task RefreshToken_Fails_With_Used_RefreshToken() {
        var passwordHasher = new PasswordHasher<User>();

        await CreateSignedInUser("double-refresh-user");

        await ExecuteOnContext(async context => {
            var user = await context.Users
                .AsTracking()
                .Include(user => user.Events)
                .Include(user => user.RefreshTokenFamilies).ThenInclude(family => family.UsedRefreshTokens)
                .SingleAsync(user => user.Name == "double-refresh-user");
            var refreshTokenFamily = user.RefreshTokenFamilies.Single();
            refreshTokenFamily.UsedRefreshTokens.Add(new UsedRefreshToken() {
                Token = refreshTokenFamily.Token
            });
            refreshTokenFamily.Token = passwordHasher.HashPassword(user, "new");
            await context.SaveChangesAsync();
        });

        var response = await Client.PostAsync("/account/refresh-token", null);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.False((await response.Content.ReadFromJsonAsync<CommandResult>())?.IsSuccess);
        Assert.False(HasRefreshToken());

        await ExecuteOnContext(async context => {
            var updatedUser = await context.Users
                .Include(user => user.Events)
                .Include(user => user.RefreshTokenFamilies).ThenInclude(family => family.UsedRefreshTokens)
                .SingleAsync(user => user.Name == "double-refresh-user");
            Assert.Equal(UserEventType.RefreshAccessTokenFailed, updatedUser.Events.OrderBy(e => e.DateTime).Last().Type);
            Assert.Empty(updatedUser.RefreshTokenFamilies);
        });

        Assert.Equal(HttpStatusCode.Unauthorized, (await Client.GetAsync("/account")).StatusCode);
    }

    [Fact]
    public async Task RefreshToken_Fails_With_Expired_RefreshToken() {
        await CreateSignedInUser("expired-refresh-user", refreshTokenExpires: DateTime.UtcNow.AddSeconds(-1));

        var response = await Client.PostAsync("/account/refresh-token", null);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.False((await response.Content.ReadFromJsonAsync<CommandResult>())?.IsSuccess);
        Assert.False(HasRefreshToken());

        await ExecuteOnContext(async context => {
            var updatedUser = await context.Users
                .Include(user => user.Events)
                .Include(user => user.RefreshTokenFamilies)
                .SingleAsync(user => user.Name == "expired-refresh-user");
            Assert.Equal(UserEventType.RefreshAccessTokenFailed, Assert.Single(updatedUser.Events).Type);
            Assert.Empty(updatedUser.RefreshTokenFamilies);
        });

        Assert.Equal(HttpStatusCode.Unauthorized, (await Client.GetAsync("/account")).StatusCode);
    }
}
