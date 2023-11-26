using FluentAssertions;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using Xunit;

namespace BulletHellBeastMode.Api.Tests;

public class JwtTokenGeneratorTests {
    [Fact]
    public void GenerateToken_Returns_Valid_Token() {
        var jwtSecurityTokenHandler = new JwtSecurityTokenHandler();
        var jwtSettings = new JwtSettings() {
            ValidAudience = "Audience",
            ValidIssuer = "Issuer",
            ExpiresInSeconds = 1800,
            SecurityKey = new byte[32]
        };
        var subject = new JwtTokenGenerator(jwtSecurityTokenHandler, Options.Create(jwtSettings));

        var result = subject.GenerateToken("Foo");

        jwtSecurityTokenHandler.ValidateToken(result, new TokenValidationParameters() {
            ValidateAudience = false,
            ValidateIssuer = false,
            ValidateLifetime = false,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(jwtSettings.SecurityKey)
        }, out var token);

        var jwtToken = token.Should().BeAssignableTo<JwtSecurityToken>().Subject;
        jwtToken.Issuer.Should().Be(jwtSettings.ValidIssuer);
        jwtToken.Claims.Should().Contain(c => c.Type == JwtRegisteredClaimNames.Aud).Which.Value.Should().Be(jwtSettings.ValidAudience);
        jwtToken.Claims.Should().Contain(c => c.Type == JwtRegisteredClaimNames.Sub).Which.Value.Should().Be("Foo");

        AssertTimestamp(jwtToken.Claims.Should().Contain(c => c.Type == JwtRegisteredClaimNames.Nbf).Which.Value, DateTime.UtcNow);
        AssertTimestamp(jwtToken.Claims.Should().Contain(c => c.Type == JwtRegisteredClaimNames.Exp).Which.Value, DateTime.UtcNow.AddSeconds(jwtSettings.ExpiresInSeconds));

        static void AssertTimestamp(string timestampValue, DateTime expectedDate) {
            int.TryParse(timestampValue, out var timestamp).Should().BeTrue();
            var expectedTimestamp = (int)(expectedDate - new DateTime(1970, 1, 1)).TotalSeconds;

            timestamp.Should().BeCloseTo(expectedTimestamp, 1);
        }
    }
}