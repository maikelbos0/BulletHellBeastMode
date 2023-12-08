using BulletHellBeastMode.Api.Database;
using BulletHellBeastMode.Api.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace BulletHellBeastMode.Api.Account;

public class SignInUserCommandHandler(BulletHellContext context, PasswordHasher<User> passwordHasher, IAccountService accountService)
    : IRequestHandler<SignInUserCommand, CommandResult> {

    public async Task<CommandResult> Handle(SignInUserCommand request, CancellationToken cancellationToken) {
        const string signInError = "Incorrect user name or password";

        var user = await context.Users.AsTracking().SingleOrDefaultAsync(user => user.Name == request.UserName);

        if (user == null) {
            return CommandResult.Failure(signInError);
        }

        var passwordVerificationResult = passwordHasher.VerifyHashedPassword(user, user.Password, request.Password);

        if (passwordVerificationResult == PasswordVerificationResult.Failed) {
            user.Events.Add(new UserEvent() {
                Type = UserEventType.FailedSignIn
            });
            await context.SaveChangesAsync();

            return CommandResult.Failure(signInError);
        }
        else if (passwordVerificationResult == PasswordVerificationResult.SuccessRehashNeeded) {
            user.Password = passwordHasher.HashPassword(user, request.Password);
        }

        var refreshToken = accountService.GenerateRefreshToken();
        user.RefreshTokenFamilies.Add(new RefreshTokenFamily() {
            Token = passwordHasher.HashPassword(user, refreshToken.Token),
            Expires = refreshToken.Expires
        });

        user.Events.Add(new UserEvent() {
            Type = UserEventType.SignedIn
        });
        await context.SaveChangesAsync();
        accountService.SignIn(user.Name, refreshToken.Token);

        return CommandResult.Success;
    }
}
