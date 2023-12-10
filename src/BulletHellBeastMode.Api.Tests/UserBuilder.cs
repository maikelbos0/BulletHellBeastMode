using BulletHellBeastMode.Api.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Runtime.CompilerServices;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;
using System.Web;

namespace BulletHellBeastMode.Api.Tests;

public class UserBuilder(WebApplicationFactory factory, CookieContainer cookieContainer, string userName) {
    private bool accessToken;
    private bool accessTokenExpired;
    private bool refreshToken;
    private RefreshTokenMode refreshTokenMode;
    private PasswordHasherCompatibilityMode passwordHasherCompatibilityMode = PasswordHasherCompatibilityMode.IdentityV3;

    public UserBuilder SignedIn() => WithAccessToken().WithRefreshToken();

    public UserBuilder WithAccessToken(bool expired = false) {
        accessToken = true;
        accessTokenExpired = expired;

        return this;
    }

    public UserBuilder WithRefreshToken(RefreshTokenMode mode = RefreshTokenMode.Default) {
        refreshToken = true;
        refreshTokenMode = mode;
        return this;
    }

    public UserBuilder WithPasswordHasherCompatibilityMode(PasswordHasherCompatibilityMode passwordHasherCompatibilityMode) {
        this.passwordHasherCompatibilityMode = passwordHasherCompatibilityMode;
        return this;
    }

    public async Task<User> Build() {
        var passwordHasher = new PasswordHasher<User>(Options.Create(new PasswordHasherOptions() { CompatibilityMode = passwordHasherCompatibilityMode }));
        var user = new User() { Name = userName };
        user.Password = passwordHasher.HashPassword(user, "password");

        using (var contextProvider = new BulletHellContextProvider(factory)) {
            await contextProvider.Context.Users.AddAsync(user);
            await contextProvider.Context.SaveChangesAsync();
        }

        if (accessToken) {
            var jwtSettings = factory.Services.GetRequiredService<IOptions<JwtSettings>>().Value;
            var jwtSecurityTokenHandler = factory.Services.GetRequiredService<JwtSecurityTokenHandler>();
            // TODO unify this also with jwt config?
            var signingCredentials = new SigningCredentials(new SymmetricSecurityKey(jwtSettings.SecurityKey), SecurityAlgorithms.HmacSha256);
            var accessToken = new JwtSecurityToken(
                issuer: jwtSettings.ValidIssuer,
                audience: jwtSettings.ValidAudience,
                claims: new List<Claim>() {
                    new(JwtRegisteredClaimNames.Sub, userName)
                },
                notBefore: DateTime.MinValue,
                expires: accessTokenExpired ? DateTime.UtcNow.AddSeconds(-60) : DateTime.UtcNow.AddSeconds(60),
                signingCredentials: signingCredentials
            );
            cookieContainer.Add(new("https://localhost"), new Cookie(Constants.AccessTokenCookieName, HttpUtility.UrlEncode(jwtSecurityTokenHandler.WriteToken(accessToken))));
        }

        if (refreshToken) {
            using (var contextProvider = new BulletHellContextProvider(factory)) {
                contextProvider.Context.Attach(user);
                var refreshToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(384));
                user.RefreshTokenFamilies.Add(new RefreshTokenFamily() {
                    Token = passwordHasher.HashPassword(user, refreshToken),
                    Expires = refreshTokenMode switch {
                        RefreshTokenMode.Expired => DateTime.UtcNow.AddSeconds(-60),
                        _ => DateTime.UtcNow.AddSeconds(60),
                    }
                });

                if (refreshTokenMode != RefreshTokenMode.ServerOnly) {
                    cookieContainer.Add(new("https://localhost"), new Cookie(Constants.RefreshTokenCookieName, HttpUtility.UrlEncode(refreshToken)));
                }

                if (refreshTokenMode == RefreshTokenMode.Used) {
                    var refreshTokenFamily = user.RefreshTokenFamilies.Single();
                    refreshTokenFamily.UsedRefreshTokens.Add(new UsedRefreshToken() {
                        Token = refreshTokenFamily.Token
                    });
                    refreshTokenFamily.Token = string.Empty;
                }

                await contextProvider.Context.SaveChangesAsync();
            }
        }

        return user;
    }

    public TaskAwaiter<User> GetAwaiter() => Build().GetAwaiter();
}
