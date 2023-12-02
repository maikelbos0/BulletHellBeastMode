using MediatR;

namespace BulletHellBeastMode.Api.Account {
    public class GetAccountDetailsQueryHandler(IAccountService accountService) : IRequestHandler<GetAccountDetailsQuery, AccountDetails> {
        public Task<AccountDetails> Handle(GetAccountDetailsQuery request, CancellationToken cancellationToken)
            => Task.FromResult(accountService.GetAcccountDetails());
    }
}
