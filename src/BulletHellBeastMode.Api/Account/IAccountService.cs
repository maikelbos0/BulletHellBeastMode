namespace BulletHellBeastMode.Api.Account {
    public interface IAccountService {
        void SignIn(string userName);
        AccountDetails GetAcccountDetails();
    }
}
