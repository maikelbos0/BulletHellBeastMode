namespace BulletHellBeastMode.Api.Account;

public interface IAccountService {
    void SignIn(string userName);
    void SignOut();
    AccountDetails GetAcccountDetails();
    string GenerateToken(string userName);
}
