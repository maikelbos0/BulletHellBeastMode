using BulletHellBeastMode.Api.Entities;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Threading.Tasks;
using Xunit;

namespace BulletHellBeastMode.Api.Tests.Account;

public class SignOutTests(WebApplicationFactory factory) : IntegrationTestBase(factory) {
    [Fact]
    public async Task SignOut_Succeeds() {
        await CreateSignedInUser("sign-out-user");

        var response = await Client.PostAsync("/account/sign-out", null);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.False(HasRefreshToken());

        await ExecuteOnContext(async context => {
            var user = await context.Users
            .Include(user => user.Events)
            .Include(user => user.RefreshTokenFamilies)
            .SingleAsync(user => user.Name == "sign-out-user");
            Assert.Equal(UserEventType.SignedOut, Assert.Single(user.Events).Type);
            Assert.Empty(user.RefreshTokenFamilies);
        });

        Assert.Equal(HttpStatusCode.Unauthorized, (await Client.GetAsync("/account")).StatusCode);
    }

    [Fact]
    public async Task SignOut_Without_Signed_In_User_Fails() {
        var response = await Client.PostAsync("/account/sign-out", null);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }
}
