using BulletHellBeastMode.Api.Account;
using BulletHellBeastMode.Api.Entities;
using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Xunit;

namespace BulletHellBeastMode.Api.Tests.Account;

public class RegisterTests : IntegrationTestBase {
    public RegisterTests(WebApplicationFactory factory) : base(factory) { }

    [Fact]
    public async Task Register_New_Name_Succeeds() {
        var response = await Client.PostAsJsonAsync("/account/register", new RegisterUserCommand("new-user", "password"));

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<CommandResult>();
        Assert.NotNull(content);
        Assert.True(content.IsSuccess);

        Assert.Single(Context.Users, user => user.Name == "new-user");

        Assert.Equal(HttpStatusCode.OK, (await Client.GetAsync("/account")).StatusCode);
    }

    [Fact]
    public async Task Register_Existing_Name_Fails() {
        await Context.Users.AddAsync(new User() { Name = "existing-user" });
        await Context.SaveChangesAsync();

        var response = await Client.PostAsJsonAsync("/account/register", new RegisterUserCommand("existing-user", "password"));

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<CommandResult>();
        Assert.NotNull(content);
        Assert.False(content.IsSuccess);

        Assert.Single(Context.Users, user => user.Name == "existing-user");

        Assert.Equal(HttpStatusCode.Unauthorized, (await Client.GetAsync("/account")).StatusCode);
    }
}
