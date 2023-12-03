namespace BulletHellBeastMode.Api.Entities;

public class User {
    public int Id { get; set; }
    public ICollection<UserEvent> Events { get; set; } = new List<UserEvent>();
    public required string Name { get; set; }
    public string Password { get; set; } = string.Empty;
}
