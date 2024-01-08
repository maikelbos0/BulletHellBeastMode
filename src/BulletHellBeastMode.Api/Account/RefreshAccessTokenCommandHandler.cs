using BulletHellBeastMode.Api.Database;
using BulletHellBeastMode.Api.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace BulletHellBeastMode.Api.Account;

public class RefreshAccessTokenCommandHandler(BulletHellContext context, AccountService accountService, PasswordHasher<User> passwordHasher) : IRequestHandler<RefreshAccessTokenCommand, CommandResult> {
    public async Task<CommandResult> Handle(RefreshAccessTokenCommand request, CancellationToken cancellationToken) {
        var userName = accountService.GetUserName(true);

        if (userName == null) {
            return await Failure(null, cancellationToken);
        }

        var user = await context.Users.AsTracking()
            .Include(user => user.RefreshTokenFamilies).ThenInclude(family => family.UsedRefreshTokens)
            .SingleAsync(user => user.Name == userName, cancellationToken);

        var refreshToken = accountService.GetRefreshToken();
        if (refreshToken == null) {
            return await Failure(user, cancellationToken);
        }

        var refreshTokenFamily = user.RefreshTokenFamilies.SingleOrDefault(family => passwordHasher.VerifyHashedPassword(user, family.Token, refreshToken) != PasswordVerificationResult.Failed);

        if (refreshTokenFamily == null) {
            var usedRefreshTokenFamily = user.RefreshTokenFamilies.SingleOrDefault(family => family.UsedRefreshTokens.Any(token => passwordHasher.VerifyHashedPassword(user, token.Token, refreshToken) != PasswordVerificationResult.Failed));
            if (usedRefreshTokenFamily != null) {
                context.RefreshTokenFamilies.Remove(usedRefreshTokenFamily);
            }
            return await Failure(user, cancellationToken);
        }
        else if (refreshTokenFamily.Expires < DateTime.UtcNow) {
            context.RefreshTokenFamilies.Remove(refreshTokenFamily);
            return await Failure(user, cancellationToken);
        }

        var newRefreshToken = accountService.GenerateRefreshToken();
        user.Events.Add(new UserEvent() {
            Type = UserEventType.AccessTokenRefreshed
        });
        refreshTokenFamily.UsedRefreshTokens.Add(new UsedRefreshToken() {
            Token = refreshTokenFamily.Token
        });
        refreshTokenFamily.Token = passwordHasher.HashPassword(user, newRefreshToken.Token);
        refreshTokenFamily.Expires = newRefreshToken.Expires;
        await context.SaveChangesAsync(cancellationToken);

        accountService.SignIn(userName, newRefreshToken.Token);
        return CommandResult.Success;
    }

    private async Task<CommandResult> Failure(User? user, CancellationToken cancellationToken) {
        if (user != null) {
            user.Events.Add(new UserEvent() {
                Type = UserEventType.RefreshAccessTokenFailed
            });
            await context.SaveChangesAsync(cancellationToken);
        }

        accountService.SignOut();
        return CommandResult.Failure("Failed to refresh access token");
    }
}
