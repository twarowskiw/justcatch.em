using FluentAssertions;
using JustCatch.Backend.Models;
using JustCatch.Backend.Services;
using Microsoft.Extensions.Caching.Memory;

namespace JustCatch.Backend.Tests.Unit;

public sealed class PokemonServiceCacheTests
{
    private sealed class FakePokeApiClient : IPokeApiClient
    {
        public int CallCount { get; private set; }

        public Task<PokemonDetails?> GetPokemonAsync(int id, CancellationToken cancellationToken = default)
        {
            CallCount++;
            return Task.FromResult<PokemonDetails?>(new PokemonDetails(
                id,
                "simisear",
                174,
                "https://example.test/image.png",
                ["fire"]));
        }
    }

    [Fact]
    public async Task GetPokemonAsync_Caches_Response_ById()
    {
        // Arrange
        var cache = new MemoryCache(new MemoryCacheOptions());
        var fake = new FakePokeApiClient();
        var svc = new PokemonService(cache, fake);

        // Act
        var p1 = await svc.GetPokemonAsync(514);
        var p2 = await svc.GetPokemonAsync(514);

        // Assert
        p1.Should().NotBeNull();
        p2.Should().NotBeNull();
        fake.CallCount.Should().Be(1);
    }

    [Fact]
    public async Task GetPokemonAsync_DoesNotCache_Null()
    {
        // Arrange
        var cache = new MemoryCache(new MemoryCacheOptions());

        var fake = new FakePokeApiClientAlwaysNull();
        var svc = new PokemonService(cache, fake);

        // Act
        var p1 = await svc.GetPokemonAsync(999999);
        var p2 = await svc.GetPokemonAsync(999999);

        // Assert
        p1.Should().BeNull();
        p2.Should().BeNull();
        fake.CallCount.Should().Be(2);
    }

    private sealed class FakePokeApiClientAlwaysNull : IPokeApiClient
    {
        public int CallCount { get; private set; }

        public Task<PokemonDetails?> GetPokemonAsync(int id, CancellationToken cancellationToken = default)
        {
            CallCount++;
            return Task.FromResult<PokemonDetails?>(null);
        }
    }
}
