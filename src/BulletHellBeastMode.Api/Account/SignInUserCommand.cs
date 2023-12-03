using MediatR;

namespace BulletHellBeastMode.Api.Account;

public record SignInUserCommand(string UserName, string Password) : IRequest<CommandResult>;
