using BulletHellBeastMode.Api.Account;
using BulletHellBeastMode.Api.Entities;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Xunit;

namespace BulletHellBeastMode.Api.Tests.Account;

// TODO test refresh token?
public class SignInTests(WebApplicationFactory factory) : IntegrationTestBase(factory) {
    [Fact]
    public async Task SignIn_With_Correct_Credentials_Succeeds() {
        await CreateUser("sign-in-user");

        var response = await Client.PostAsJsonAsync("/account/sign-in", new SignInUserCommand("sign-in-user", "password"));

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.True((await response.Content.ReadFromJsonAsync<CommandResult>())?.IsSuccess);

        await ExecuteOnContext(async context => {
            var user = await context.Users.Include(user => user.Events).SingleAsync(user => user.Name == "sign-in-user");
            Assert.Equal(UserEventType.SignedIn, Assert.Single(user.Events).Type);
        });

        Assert.Equal(HttpStatusCode.OK, (await Client.GetAsync("/account")).StatusCode);
    }

    [Fact]
    public async Task SignIn_With_Old_HashAlgorithmn_Rehashes_Password() {
        var user = await CreateUser("rehash-user", true);

        var response = await Client.PostAsJsonAsync("/account/sign-in", new SignInUserCommand("rehash-user", "password"));

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.True((await response.Content.ReadFromJsonAsync<CommandResult>())?.IsSuccess);

        await ExecuteOnContext(async context => {
            var updatedUser = await context.Users.Include(user => user.Events).SingleAsync(user => user.Name == "rehash-user");
            Assert.NotEqual(updatedUser.Password, user.Password);
            Assert.Equal(UserEventType.SignedIn, Assert.Single(updatedUser.Events).Type);
        });

        Assert.Equal(HttpStatusCode.OK, (await Client.GetAsync("/account")).StatusCode);
    }

    [Fact]
    public async Task SignIn_With_Invalid_UserName_Fails() {
        var response = await Client.PostAsJsonAsync("/account/sign-in", new SignInUserCommand("not-a-user", "password"));

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.False((await response.Content.ReadFromJsonAsync<CommandResult>())?.IsSuccess);

        Assert.Equal(HttpStatusCode.Unauthorized, (await Client.GetAsync("/account")).StatusCode);
    }

    [Fact]
    public async Task SignIn_With_Invalid_Password_Fails() {
        await CreateUser("password-user");

        var response = await Client.PostAsJsonAsync("/account/sign-in", new SignInUserCommand("password-user", "wrong"));

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.False((await response.Content.ReadFromJsonAsync<CommandResult>())?.IsSuccess);

        await ExecuteOnContext(async context => {
            var updatedUser = await context.Users.Include(user => user.Events).SingleAsync(user => user.Name == "password-user");
            Assert.Equal(UserEventType.FailedSignIn, Assert.Single(updatedUser.Events).Type);
        });

        Assert.Equal(HttpStatusCode.Unauthorized, (await Client.GetAsync("/account")).StatusCode);
    }
}
