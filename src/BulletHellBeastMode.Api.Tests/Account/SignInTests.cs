﻿using BulletHellBeastMode.Api.Account;
using System.Net.Http.Json;
using System.Net;
using System.Threading.Tasks;
using Xunit;
using BulletHellBeastMode.Api.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using System.Security.Cryptography;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace BulletHellBeastMode.Api.Tests.Account;

public class SignInTests : IntegrationTestBase {
    public SignInTests(WebApplicationFactory factory) : base(factory) { }

    [Fact]
    public async Task SignIn_With_Correct_Credentials_Succeeds() {
        var passwordHasher = new PasswordHasher<User>();
        var user = new User() { Name = "sign-in-user" };
        user.Password = passwordHasher.HashPassword(user, "password");
        await Context.Users.AddAsync(user);
        await Context.SaveChangesAsync();

        var response = await Client.PostAsJsonAsync("/account/sign-in", new SignInUserCommand("sign-in-user", "password"));

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<CommandResult>();
        Assert.NotNull(content);
        Assert.True(content.IsSuccess);

        var updatedUser = Context.Users.Include(user => user.UserEvents).Single(user => user.Name == "sign-in-user");
        Assert.Equal(UserEventType.LoggedIn, Assert.Single(updatedUser.UserEvents).Type);

        Assert.Equal(HttpStatusCode.OK, (await Client.GetAsync("/account")).StatusCode);
    }

    [Fact]
    public async Task SignIn_With_Old_HashAlgorithmn_Rehashes_Password() {
        var passwordHasher = new PasswordHasher<User>(Options.Create(new PasswordHasherOptions() { CompatibilityMode = PasswordHasherCompatibilityMode.IdentityV2 }));
        var user = new User() { Name = "rehash-user" };
        user.Password = passwordHasher.HashPassword(user, "password");
        await Context.Users.AddAsync(user);
        await Context.SaveChangesAsync();

        var response = await Client.PostAsJsonAsync("/account/sign-in", new SignInUserCommand("rehash-user", "password"));

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<CommandResult>();
        Assert.NotNull(content);
        Assert.True(content.IsSuccess);

        var updatedUser = Context.Users.Include(user => user.UserEvents).Single(user => user.Name == "rehash-user");
        Assert.NotEqual(updatedUser.Password, user.Password);
        Assert.Equal(UserEventType.LoggedIn, Assert.Single(updatedUser.UserEvents).Type);

        Assert.Equal(HttpStatusCode.OK, (await Client.GetAsync("/account")).StatusCode);
    }

    [Fact]
    public async Task SignIn_With_Invalid_UserName_Fails() {
        var response = await Client.PostAsJsonAsync("/account/sign-in", new SignInUserCommand("not-a-user", "password"));

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<CommandResult>();
        Assert.NotNull(content);
        Assert.False(content.IsSuccess);

        Assert.Equal(HttpStatusCode.Unauthorized, (await Client.GetAsync("/account")).StatusCode);
    }

    [Fact]
    public async Task SignIn_With_Invalid_Password_Fails() {
        var passwordHasher = new PasswordHasher<User>();
        var user = new User() { Name = "password-user" };
        user.Password = passwordHasher.HashPassword(user, "password");
        await Context.Users.AddAsync(user);
        await Context.SaveChangesAsync();

        var response = await Client.PostAsJsonAsync("/account/sign-in", new SignInUserCommand("password-user", "wrong"));

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<CommandResult>();
        Assert.NotNull(content);
        Assert.False(content.IsSuccess);

        var updatedUser = Context.Users.Include(user => user.UserEvents).Single(user => user.Name == "password-user");
        Assert.Equal(UserEventType.FailedLogIn, Assert.Single(updatedUser.UserEvents).Type);

        Assert.Equal(HttpStatusCode.Unauthorized, (await Client.GetAsync("/account")).StatusCode);
    }
}