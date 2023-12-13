using BulletHellBeastMode.Api.Account;
using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Xunit;

namespace BulletHellBeastMode.Api.Tests.Account;

// TODO test refresh token?
public class RegisterTests(WebApplicationFactory factory) : IntegrationTestBase(factory) {
    [Fact]
    public async Task Register_New_Name_Succeeds() {
        var response = await Client.PostAsJsonAsync("/account/register", new RegisterUserCommand("new-user", "password"));

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.True((await response.Content.ReadFromJsonAsync<CommandResult>())?.IsSuccess);

        await ExecuteOnContext(context => {
            Assert.Single(context.Users, user => user.Name == "new-user");
            return Task.CompletedTask;
        });

        Assert.Equal(HttpStatusCode.OK, (await Client.GetAsync("/account")).StatusCode);
    }

    [Fact]
    public async Task Register_Existing_Name_Fails() {
        await CreateUser("existing-user");

        var response = await Client.PostAsJsonAsync("/account/register", new RegisterUserCommand("existing-user", "password"));

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.False((await response.Content.ReadFromJsonAsync<CommandResult>())?.IsSuccess);

        await ExecuteOnContext(context => {
            Assert.Single(context.Users, user => user.Name == "existing-user");
            return Task.CompletedTask;
        });

        Assert.Equal(HttpStatusCode.Unauthorized, (await Client.GetAsync("/account")).StatusCode);
    }
}
