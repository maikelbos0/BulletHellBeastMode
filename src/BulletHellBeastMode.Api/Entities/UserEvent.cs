namespace BulletHellBeastMode.Api.Entities;

public class UserEvent {
    public int Id { get; set; }
    public required User User { get; set; }
    public required DateTimeOffset DateTime { get; set; }
    public required UserEventType Type { get; set; }
}
