using BulletHellBeastMode.Api.Database;
using BulletHellBeastMode.Api.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace BulletHellBeastMode.Api.Commands.Account {
    public record RegisterUserCommand(string UserName, string Password) : IRequest<CommandResult>;

    public class RegisterUserCommandHandler(BulletHellContext context, PasswordHasher<User> passwordHasher, IHttpContextAccessor httpContextAccessor)
        : IRequestHandler<RegisterUserCommand, CommandResult> {

        public async Task<CommandResult> Handle(RegisterUserCommand request, CancellationToken cancellationToken) {
            if (await context.Users.AnyAsync(user => user.Name == request.UserName, cancellationToken)) {
                return CommandResult.Failure("A user with this name already exists");
            }

            var user = new User() {
                Name = request.UserName
            };
            user.Password = passwordHasher.HashPassword(user, request.Password);

            await context.Users.AddAsync(user, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);

            httpContextAccessor.HttpContext?.Response.Cookies.Append(
                Constants.AccessTokenCookieName, 
                "jwtToken", // TODO, maybe we create account service?
                new CookieOptions() { HttpOnly = true, SameSite = SameSiteMode.Strict, Secure = true }
            );

            return CommandResult.Success;
        }
    }
}
