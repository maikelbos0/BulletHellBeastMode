﻿using BulletHellBeastMode.Api.Database;
using BulletHellBeastMode.Api.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace BulletHellBeastMode.Api.Account;

public class SignInUserCommandHandler(BulletHellContext context, PasswordHasher<User> passwordHasher, IAccountService accountService)
    : IRequestHandler<SignInUserCommand, CommandResult> {

    public async Task<CommandResult> Handle(SignInUserCommand request, CancellationToken cancellationToken) {
        const string signInError = "Incorrect user name or password";

        var user = await context.Users.AsTracking().SingleOrDefaultAsync(user => user.Name == request.UserName);

        if (user == null) {
            return CommandResult.Failure(signInError);
        }

        var passwordVerificationResult = passwordHasher.VerifyHashedPassword(user, user.Password, request.Password);

        if (passwordVerificationResult == PasswordVerificationResult.Failed) {
            user.UserEvents.Add(new UserEvent() {
                Type = UserEventType.FailedLogIn
            });
            await context.SaveChangesAsync();

            return CommandResult.Failure(signInError);
        }
        else if (passwordVerificationResult == PasswordVerificationResult.SuccessRehashNeeded) {
            user.Password = passwordHasher.HashPassword(user, request.Password);
        }

        user.UserEvents.Add(new UserEvent() {
            Type = UserEventType.LoggedIn
        });
        await context.SaveChangesAsync();
        accountService.SignIn(user.Name);

        return CommandResult.Success;
    }
}