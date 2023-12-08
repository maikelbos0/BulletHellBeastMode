namespace BulletHellBeastMode.Api.Account;

// TODO Do we still need this interface?
public interface IAccountService {
    void SignIn(string userName, string refreshToken);
    string GenerateAccessToken(string userName);
    RefreshTokenDetails GenerateRefreshToken();
    AccountDetails GetAcccountDetails();
    string? GetRefreshToken();
    void SignOut();
}
