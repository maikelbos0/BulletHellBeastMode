namespace BulletHellBeastMode.Api;

public record CommandResult(string[] Errors)
{
    public static CommandResult Success { get; } = new CommandResult([]);

    public static CommandResult Failure(params string[] Errors) => new(Errors);

    public bool IsSuccess => Errors.Length == 0;
}
