using BulletHellBeastMode.Api.Database;
using BulletHellBeastMode.Api.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BulletHellBeastMode.Api.Account;

public class SignOutUserCommandHandler(BulletHellContext context, IAccountService accountService)
    : IRequestHandler<SignOutUserCommand> {
    public async Task Handle(SignOutUserCommand request, CancellationToken cancellationToken) {
        var user = await context.Users.AsTracking().SingleAsync(user => user.Name == accountService.GetAcccountDetails().UserName);

        user.Events.Add(new UserEvent() {
            Type = UserEventType.SignedOut
        });
        await context.SaveChangesAsync();
        accountService.SignOut();
    }
}
