namespace BulletHellBeastMode.Api.Account;

// TODO Do we still need this interface?
public interface IAccountService {
    void SignIn(string userName, string refreshToken);
    void SignOut();
    AccountDetails GetAcccountDetails();
    string GenerateAccessToken(string userName);
    RefreshTokenDetails GenerateRefreshToken();
}
