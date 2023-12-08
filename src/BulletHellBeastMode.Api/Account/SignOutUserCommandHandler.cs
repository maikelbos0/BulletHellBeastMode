using BulletHellBeastMode.Api.Database;
using BulletHellBeastMode.Api.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace BulletHellBeastMode.Api.Account;

public class SignOutUserCommandHandler(BulletHellContext context, IAccountService accountService, PasswordHasher<User> passwordHasher)
    : IRequestHandler<SignOutUserCommand> {

    public async Task Handle(SignOutUserCommand request, CancellationToken cancellationToken) {
        var user = await context.Users.AsTracking()
            .Include(user => user.RefreshTokenFamilies)
            .SingleAsync(user => user.Name == accountService.GetAcccountDetails().UserName);

        user.Events.Add(new UserEvent() {
            Type = UserEventType.SignedOut
        });

        var refreshToken = accountService.GetRefreshToken();
        if (refreshToken != null) {
            var refreshTokenFamily = user.RefreshTokenFamilies.SingleOrDefault(family => passwordHasher.VerifyHashedPassword(user, family.Token, refreshToken) != PasswordVerificationResult.Failed);
            if (refreshTokenFamily != null) {
                context.RefreshTokenFamily.Remove(refreshTokenFamily);
            }
        }

        await context.SaveChangesAsync();
        accountService.SignOut();
    }
}
