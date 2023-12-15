using BulletHellBeastMode.Api.Database;
using BulletHellBeastMode.Api.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace BulletHellBeastMode.Api.Account;

public class RegisterUserCommandHandler(BulletHellContext context, PasswordHasher<User> passwordHasher, AccountService accountService) : IRequestHandler<RegisterUserCommand, CommandResult> {
    public async Task<CommandResult> Handle(RegisterUserCommand request, CancellationToken cancellationToken) {
        if (await context.Users.AnyAsync(user => user.Name == request.UserName, cancellationToken)) {
            return CommandResult.Failure("A user with this name already exists");
        }

        var user = new User() {
            Name = request.UserName
        };
        user.Password = passwordHasher.HashPassword(user, request.Password);

        var refreshToken = accountService.GenerateRefreshToken();
        user.RefreshTokenFamilies.Add(new RefreshTokenFamily() {
            Token = passwordHasher.HashPassword(user, refreshToken.Token),
            Expires = refreshToken.Expires
        });

        await context.Users.AddAsync(user, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);

        accountService.SignIn(user.Name, refreshToken.Token);

        return CommandResult.Success;
    }
}
