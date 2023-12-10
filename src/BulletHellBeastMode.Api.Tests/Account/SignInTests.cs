﻿using BulletHellBeastMode.Api.Account;
using System.Net.Http.Json;
using System.Net;
using System.Threading.Tasks;
using Xunit;
using BulletHellBeastMode.Api.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace BulletHellBeastMode.Api.Tests.Account;

// TODO test refresh token?
public class SignInTests(WebApplicationFactory factory) : IntegrationTestBase(factory) {
    [Fact]
    public async Task SignIn_With_Correct_Credentials_Succeeds() {
        await CreateUser("sign-in-user");

        var response = await Client.PostAsJsonAsync("/account/sign-in", new SignInUserCommand("sign-in-user", "password"));

        // TODO extract some response stuff here?
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<CommandResult>();
        Assert.NotNull(content);
        Assert.True(content.IsSuccess);

        using (var contextProvider = CreateContextProvider()) {
            var updatedUser = contextProvider.Context.Users.Include(user => user.Events).Single(user => user.Name == "sign-in-user");
            Assert.Equal(UserEventType.SignedIn, Assert.Single(updatedUser.Events).Type);
        }

        Assert.Equal(HttpStatusCode.OK, (await Client.GetAsync("/account")).StatusCode);
    }

    [Fact]
    public async Task SignIn_With_Old_HashAlgorithmn_Rehashes_Password() {
        var user = await CreateUser("rehash-user")
            .WithPasswordHasherCompatibilityMode(PasswordHasherCompatibilityMode.IdentityV2);

        var response = await Client.PostAsJsonAsync("/account/sign-in", new SignInUserCommand("rehash-user", "password"));

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<CommandResult>();
        Assert.NotNull(content);
        Assert.True(content.IsSuccess);

        using (var contextProvider = CreateContextProvider()) {
            var updatedUser = contextProvider.Context.Users.Include(user => user.Events).Single(user => user.Name == "rehash-user");
            Assert.NotEqual(updatedUser.Password, user.Password);
            Assert.Equal(UserEventType.SignedIn, Assert.Single(updatedUser.Events).Type);
        }

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
        await CreateUser("password-user");

        var response = await Client.PostAsJsonAsync("/account/sign-in", new SignInUserCommand("password-user", "wrong"));

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<CommandResult>();
        Assert.NotNull(content);
        Assert.False(content.IsSuccess);

        using (var contextProvider = CreateContextProvider()) {
            var updatedUser = contextProvider.Context.Users.Include(user => user.Events).Single(user => user.Name == "password-user");
            Assert.Equal(UserEventType.FailedSignIn, Assert.Single(updatedUser.Events).Type);
        }

        Assert.Equal(HttpStatusCode.Unauthorized, (await Client.GetAsync("/account")).StatusCode);
    }
}
