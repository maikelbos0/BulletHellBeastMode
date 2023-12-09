using MediatR;

namespace BulletHellBeastMode.Api.Account;

public record RefreshAccessTokenCommand() : IRequest<CommandResult>;
