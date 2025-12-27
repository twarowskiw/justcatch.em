using JustCatch.Backend.Models;

namespace JustCatch.Backend.Services;

public interface IPokemonCatalog
{
    PokemonCatalogEntry? GetById(int id);
    IReadOnlyList<SearchSuggestion> Search(string query, int limit);
}

public sealed class PokemonCatalogEntry
{
    public int Id { get; init; }
    public string Name { get; init; } = "";
}
