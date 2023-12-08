namespace BulletHellBeastMode.Api.Entities;

public class RefreshTokenFamily {
    public int Id { get; set; }
    public ICollection<UsedRefreshToken> UsedRefreshTokens { get; set; } = new List<UsedRefreshToken>();
    public required string Token { get; set; }
    public required DateTimeOffset Expires { get; set; }
}
