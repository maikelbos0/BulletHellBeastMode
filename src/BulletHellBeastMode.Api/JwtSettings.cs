﻿using System.Security.Cryptography;

namespace BulletHellBeastMode.Api;

public class JwtSettings {
    public static byte[] DefaultSecurityKey { get; } = RandomNumberGenerator.GetBytes(32);

    public string? ValidIssuer { get; set; }
    public string? ValidAudience { get; set; }
    public int AccessTokenExpiresInSeconds { get; set; }
    public int RefreshTokenExpiresInSeconds { get; set; }
    public byte[] SecurityKey { get; set; } = DefaultSecurityKey;
}
