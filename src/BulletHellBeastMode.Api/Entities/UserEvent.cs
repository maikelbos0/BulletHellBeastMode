namespace BulletHellBeastMode.Api.Entities;

public class UserEvent {
    public int Id { get; set; }
    public DateTimeOffset DateTime { get; set; } = DateTimeOffset.Now;
    public required UserEventType Type { get; set; }
}
