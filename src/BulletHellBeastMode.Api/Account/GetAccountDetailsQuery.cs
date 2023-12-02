using MediatR;

namespace BulletHellBeastMode.Api.Account {
    public record GetAccountDetailsQuery() : IRequest<AccountDetails>;
}
