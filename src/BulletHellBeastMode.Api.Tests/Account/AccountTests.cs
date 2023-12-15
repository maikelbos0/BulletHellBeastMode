using BulletHellBeastMode.Api.Account;
using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Xunit;

namespace BulletHellBeastMode.Api.Tests.Account;

public class AccountTests(WebApplicationFactory factory) : IntegrationTestBase(factory) {
    [Fact]
    public async Task Account_Signed_In_Succeeds() {
        await CreateSignedInUser("account-user");

        var response = await Client.GetAsync("/account");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var accountDetails = await response.Content.ReadFromJsonAsync<AccountDetails>();
        Assert.NotNull(accountDetails);
        Assert.Equal("account-user", accountDetails.UserName);
        Assert.Equal("account-user", accountDetails.DisplayName);
    }

    [Fact]
    public async Task SignOut_Without_Signed_In_User_Fails() {
        var response = await Client.GetAsync("/account");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }
}
