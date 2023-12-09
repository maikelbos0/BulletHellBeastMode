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
        await CreateSignedInUser("refresh-user", DateTime.UtcNow.AddSeconds(3600), DateTime.UtcNow.AddSeconds(3600));

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
        await CreateSignedInUser("expired-refresh-user", DateTime.UtcNow.AddSeconds(-3600), DateTime.UtcNow.AddSeconds(3600));

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
                .Single(user => user.Name == "expired-refresh-user");
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
    }

    [Fact]
    public async Task RefreshToken_Fails_Without_RefreshToken() {
    }

    [Fact]
    public async Task RefreshToken_Fails_With_Used_RefreshToken() {

    }

    [Fact]
    public async Task RefreshToken_Fails_With_Expired_RefreshToken() {

    }

    private async Task CreateSignedInUser(string userName, DateTime accessTokenExpires, DateTime refreshTokenExpires) {
        var passwordHasher = GetService<PasswordHasher<User>>();
        var refreshToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(384));
        var user = new User() { Name = userName };
        user.Password = passwordHasher.HashPassword(user, "password");
        user.RefreshTokenFamilies.Add(new RefreshTokenFamily() {
            Token = passwordHasher.HashPassword(user, refreshToken),
            Expires = refreshTokenExpires
        });

        using (var contextProvider = CreateContextProvider()) {
            await contextProvider.Context.Users.AddAsync(user);
            await contextProvider.Context.SaveChangesAsync();
        }
        
        var jwtSettings = GetService<IOptions<JwtSettings>>().Value;
        var jwtSecurityTokenHandler = GetService<JwtSecurityTokenHandler>();
        var signingCredentials = new SigningCredentials(new SymmetricSecurityKey(jwtSettings.SecurityKey), SecurityAlgorithms.HmacSha256);
        var accessToken = new JwtSecurityToken(
            issuer: jwtSettings.ValidIssuer,
            audience: jwtSettings.ValidAudience,
            claims: new List<Claim>()
            {
                new(JwtRegisteredClaimNames.Sub, userName)
            },
            notBefore: DateTime.MinValue,
            expires: accessTokenExpires,
            signingCredentials: signingCredentials
        );

        SetCookie(Constants.AccessTokenCookieName, jwtSecurityTokenHandler.WriteToken(accessToken));
        SetCookie(Constants.RefreshTokenCookieName, refreshToken);
    }
}
