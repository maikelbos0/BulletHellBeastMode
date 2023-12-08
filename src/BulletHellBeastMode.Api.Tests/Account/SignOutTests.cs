using System.Net;
using System.Threading.Tasks;
using Xunit;
using BulletHellBeastMode.Api.Entities;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace BulletHellBeastMode.Api.Tests.Account;

// TODO test refresh token?
public class SignOutTests : IntegrationTestBase {
    public SignOutTests(WebApplicationFactory factory) : base(factory) { }

    [Fact]
    public async Task SignOut_Succeeds() {
        using (var contextProvider = CreateContextProvider()) {
            await contextProvider.Context.Users.AddAsync(new User() { Name = "sign-out-user" });
            await contextProvider.Context.SaveChangesAsync();
        }

        AuthenticateClient("sign-out-user");

        var response = await Client.PostAsync("/account/sign-out", null);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        using (var contextProvider = CreateContextProvider()) {
            var updatedUser = contextProvider.Context.Users.Include(user => user.Events).Single(user => user.Name == "sign-out-user");
            Assert.Equal(UserEventType.SignedOut, Assert.Single(updatedUser.Events).Type);
        }

        Assert.Equal(HttpStatusCode.Unauthorized, (await Client.GetAsync("/account")).StatusCode);
    }

    [Fact]
    public async Task SignOut_Without_Signed_In_User_Fails() {
        var response = await Client.PostAsync("/account/sign-out", null);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }
}
