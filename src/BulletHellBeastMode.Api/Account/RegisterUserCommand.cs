using MediatR;

namespace BulletHellBeastMode.Api.Account {
    public record RegisterUserCommand(string UserName, string Password) : IRequest<CommandResult>;
}
