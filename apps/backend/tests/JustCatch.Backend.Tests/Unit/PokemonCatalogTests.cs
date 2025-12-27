using JustCatch.Backend.Models;
using JustCatch.Backend.Services;
using FluentAssertions;

namespace JustCatch.Backend.Tests.Unit;

public sealed class PokemonCatalogTests
{
    [Fact]
    public void Search_Returns_Deterministic_TopMatches_WithStableOrdering()
    {
        // Arrange: keep this independent of pokemon.json to make it fast and deterministic.
        var entries = new List<PokemonCatalogEntry>
        {
            new() { Id = 1, Name = "bulbasaur" },
            new() { Id = 4, Name = "charmander" },
            new() { Id = 7, Name = "squirtle" },
            new() { Id = 25, Name = "pikachu" },
            new() { Id = 39, Name = "jigglypuff" },
        };

        var catalog = PokemonCatalog.LoadFromEntries(entries);

        // Act
        var r1 = catalog.Search("pika", limit: 3);
        var r2 = catalog.Search("pika", limit: 3);

        // Assert
        r1.Should().HaveCountGreaterThan(0);
        r2.Should().HaveCount(r1.Count);

        r1.Select(x => x.Id).Should().Equal(r2.Select(x => x.Id));
        r1.Select(x => x.Score).Should().Equal(r2.Select(x => x.Score));

        // The best match should be pikachu
        r1[0].Id.Should().Be(25);
        r1[0].Name.Should().Be("pikachu");
    }
}
