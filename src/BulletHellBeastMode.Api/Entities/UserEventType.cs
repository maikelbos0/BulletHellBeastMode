namespace BulletHellBeastMode.Api.Entities;

public enum UserEventType {
    SignedIn = 1,
    FailedSignIn = 2,
    Registered = 3,
    SignedOut = 7,
    PasswordChanged = 8,
    FailedPasswordChange = 9
}
