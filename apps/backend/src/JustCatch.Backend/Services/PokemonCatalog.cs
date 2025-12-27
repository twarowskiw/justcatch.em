using System.Text.Json;
using JustCatch.Backend.Models;

namespace JustCatch.Backend.Services;

public sealed class PokemonCatalog : IPokemonCatalog
{
    private readonly List<PokemonCatalogEntry> _entries;

    private PokemonCatalog(List<PokemonCatalogEntry> entries)
    {
        _entries = entries;
    }

    internal static PokemonCatalog LoadFromEntries(IEnumerable<PokemonCatalogEntry> entries)
        => new(entries.ToList());

    public static PokemonCatalog LoadFromFile(string path)
    {
        var json = File.ReadAllText(path);
        var root = JsonSerializer.Deserialize<PokemonCatalogRoot>(json,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        var entries = root?.Data ?? [];

        return new PokemonCatalog(entries);
    }

    public PokemonCatalogEntry? GetById(int id) => _entries.FirstOrDefault(e => e.Id == id);

    public IReadOnlyList<SearchSuggestion> Search(string query, int limit)
    {
        // Use string-based extraction to keep compatibility across FuzzySharp versions.
        var universe = _entries.Select(e => e.Name).ToList();
        var matches = FuzzySharp.Process.ExtractTop(query, universe, limit: limit);

        // Map matches back to entries (first match is fine; names are unique in pokemon.json).
        return matches
            .Select(m =>
            {
                var entry = _entries.First(e => string.Equals(e.Name, m.Value, StringComparison.OrdinalIgnoreCase));
                return new SearchSuggestion(entry.Id, entry.Name, m.Score);
            })
            .ToList();
    }
}

internal sealed class PokemonCatalogRoot
{
    public List<PokemonCatalogEntry> Data { get; set; } = [];
}
