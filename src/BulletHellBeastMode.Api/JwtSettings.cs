namespace BulletHellBeastMode.Api;

public class JwtSettings {
    public string? ValidIssuer { get; set; }
    public string? ValidAudience { get; set; }
    public int ExpiresInSeconds { get; set; }
    public byte[]? SecurityKey { get; set; }
}
