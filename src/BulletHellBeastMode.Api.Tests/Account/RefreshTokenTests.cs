using BulletHellBeastMode.Api.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using System.Security.Cryptography;
using System.Net.Http.Json;
using System.Net;
using Xunit;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace BulletHellBeastMode.Api.Tests.Account;

public class RefreshTokenTests(WebApplicationFactory factory) : IntegrationTestBase(factory) {
    [Fact]
    public async Task RefreshToken_Succeeds() {
        await CreateUser("refresh-user").SignedIn();

        var originalAccessToken = GetCookie(Constants.AccessTokenCookieName);
        var originalRefreshToken = GetCookie(Constants.RefreshTokenCookieName);

        var response = await Client.PostAsync("/account/refresh-token", null);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<CommandResult>();
        Assert.NotNull(content);
        Assert.True(content.IsSuccess);

        Assert.NotEqual(originalAccessToken, GetCookie(Constants.AccessTokenCookieName));
        Assert.NotEqual(originalRefreshToken, GetCookie(Constants.RefreshTokenCookieName));

        using (var contextProvider = CreateContextProvider()) {
            var updatedUser = contextProvider.Context.Users
                .Include(user => user.Events)
                .Include(user => user.RefreshTokenFamilies).ThenInclude(family => family.UsedRefreshTokens)
                .Single(user => user.Name == "refresh-user");
            var passwordHasher = GetService<PasswordHasher<User>>();
            Assert.Equal(UserEventType.AccessTokenRefreshed, Assert.Single(updatedUser.Events).Type);
            var family = Assert.Single(updatedUser.RefreshTokenFamilies);
            Assert.NotEqual(PasswordVerificationResult.Failed, passwordHasher.VerifyHashedPassword(updatedUser, family.Token, GetCookie(Constants.RefreshTokenCookieName)));
            Assert.NotEqual(PasswordVerificationResult.Failed, passwordHasher.VerifyHashedPassword(updatedUser, Assert.Single(family.UsedRefreshTokens).Token, originalRefreshToken));
        }

        Assert.Equal(HttpStatusCode.OK, (await Client.GetAsync("/account")).StatusCode);
    }

    [Fact]
    public async Task RefreshToken_Succeeds_With_Expired_AccessToken() {
        await CreateUser("expired-access-refresh-user")
            .WithAccessToken(true)
            .WithRefreshToken();

        var originalAccessToken = GetCookie(Constants.AccessTokenCookieName);
        var originalRefreshToken = GetCookie(Constants.RefreshTokenCookieName);

        var response = await Client.PostAsync("/account/refresh-token", null);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<CommandResult>();
        Assert.NotNull(content);
        Assert.True(content.IsSuccess);

        Assert.NotEqual(originalAccessToken, GetCookie(Constants.AccessTokenCookieName));
        Assert.NotEqual(originalRefreshToken, GetCookie(Constants.RefreshTokenCookieName));

        using (var contextProvider = CreateContextProvider()) {
            var updatedUser = contextProvider.Context.Users
                .Include(user => user.Events)
                .Include(user => user.RefreshTokenFamilies).ThenInclude(family => family.UsedRefreshTokens)
                .Single(user => user.Name == "expired-access-refresh-user");
            var passwordHasher = GetService<PasswordHasher<User>>();
            Assert.Equal(UserEventType.AccessTokenRefreshed, Assert.Single(updatedUser.Events).Type);
            var family = Assert.Single(updatedUser.RefreshTokenFamilies);
            Assert.NotEqual(PasswordVerificationResult.Failed, passwordHasher.VerifyHashedPassword(updatedUser, family.Token, GetCookie(Constants.RefreshTokenCookieName)));
            Assert.NotEqual(PasswordVerificationResult.Failed, passwordHasher.VerifyHashedPassword(updatedUser, Assert.Single(family.UsedRefreshTokens).Token, originalRefreshToken));
        }

        Assert.Equal(HttpStatusCode.OK, (await Client.GetAsync("/account")).StatusCode);
    }

    [Fact]
    public async Task RefreshToken_Fails_Without_AccessToken() {
        await CreateUser("no-access-refresh-user")
            .WithRefreshToken();

        var response = await Client.PostAsync("/account/refresh-token", null);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<CommandResult>();
        Assert.NotNull(content);
        Assert.False(content.IsSuccess);

        Assert.Equal(HttpStatusCode.Unauthorized, (await Client.GetAsync("/account")).StatusCode);
    }

    [Fact]
    public async Task RefreshToken_Fails_Without_RefreshToken() {
        await CreateUser("no-refresh-refresh-user")
            .WithAccessToken()
            .WithRefreshToken(RefreshTokenMode.ServerOnly);

        var response = await Client.PostAsync("/account/refresh-token", null);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<CommandResult>();
        Assert.NotNull(content);
        Assert.False(content.IsSuccess);

        using (var contextProvider = CreateContextProvider()) {
            var updatedUser = contextProvider.Context.Users
                .Include(user => user.Events)
                .Include(user => user.RefreshTokenFamilies).ThenInclude(family => family.UsedRefreshTokens)
                .Single(user => user.Name == "no-refresh-refresh-user");
            Assert.Equal(UserEventType.RefreshAccessTokenFailed, Assert.Single(updatedUser.Events).Type);
            var family = Assert.Single(updatedUser.RefreshTokenFamilies);
            Assert.Empty(family.UsedRefreshTokens);
        }

        Assert.Equal(HttpStatusCode.Unauthorized, (await Client.GetAsync("/account")).StatusCode);
    }

    [Fact]
    public async Task RefreshToken_Fails_With_Used_RefreshToken() {
        await CreateUser("double-refresh-user")
            .WithAccessToken()
            .WithRefreshToken();

        var originalRefreshToken = GetCookie(Constants.RefreshTokenCookieName);
        
        Assert.Equal(HttpStatusCode.OK, (await Client.PostAsync("/account/refresh-token", null)).StatusCode);

        SetCookie(Constants.RefreshTokenCookieName, originalRefreshToken);

        var response = await Client.PostAsync("/account/refresh-token", null);

        var content = await response.Content.ReadFromJsonAsync<CommandResult>();
        Assert.NotNull(content);
        Assert.False(content.IsSuccess);

        using (var contextProvider = CreateContextProvider()) {
            var updatedUser = contextProvider.Context.Users
                .Include(user => user.Events)
                .Include(user => user.RefreshTokenFamilies).ThenInclude(family => family.UsedRefreshTokens)
                .Single(user => user.Name == "double-refresh-user");
            var passwordHasher = GetService<PasswordHasher<User>>();
            Assert.Equal(UserEventType.RefreshAccessTokenFailed, updatedUser.Events.OrderBy(e => e.DateTime).Last().Type);
            Assert.Empty(updatedUser.RefreshTokenFamilies);
        }

        Assert.Equal(HttpStatusCode.Unauthorized, (await Client.GetAsync("/account")).StatusCode);
    }

    [Fact]
    public async Task RefreshToken_Fails_With_Expired_RefreshToken() {
        await CreateUser("expired-refresh-user")
            .WithAccessToken()
            .WithRefreshToken(RefreshTokenMode.Expired);

        var response = await Client.PostAsync("/account/refresh-token", null);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<CommandResult>();
        Assert.NotNull(content);
        Assert.False(content.IsSuccess);

        using (var contextProvider = CreateContextProvider()) {
            var updatedUser = contextProvider.Context.Users
                .Include(user => user.Events)
                .Include(user => user.RefreshTokenFamilies).ThenInclude(family => family.UsedRefreshTokens)
                .Single(user => user.Name == "expired-refresh-user");
            var passwordHasher = GetService<PasswordHasher<User>>();
            Assert.Equal(UserEventType.RefreshAccessTokenFailed, Assert.Single(updatedUser.Events).Type);
            Assert.Empty(updatedUser.RefreshTokenFamilies);
        }

        Assert.Equal(HttpStatusCode.Unauthorized, (await Client.GetAsync("/account")).StatusCode);
    }
}
