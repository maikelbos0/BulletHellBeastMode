using Microsoft.Extensions.Options;
using NSubstitute;

namespace BulletHellBeastMode.Api.Tests;

public static class OptionsSnapshot {
    public static IOptionsSnapshot<T> Create<T>(T settings) where T : class {
        var snapshot = Substitute.For<IOptionsSnapshot<T>>();

        snapshot.Value.Returns(settings);

        return snapshot;
    }
}
