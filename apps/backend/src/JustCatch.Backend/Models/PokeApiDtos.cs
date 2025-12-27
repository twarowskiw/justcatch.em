namespace JustCatch.Backend.Models;

using System.Text.Json.Serialization;

public sealed class PokeApiPokemonResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    // PokeAPI uses snake_case: base_experience
    [JsonPropertyName("base_experience")]
    public int BaseExperience { get; set; }
    public PokeApiSprites? Sprites { get; set; }
    public PokeApiTypeSlot[]? Types { get; set; }
}

public sealed class PokeApiSprites
{
    // PokeAPI uses snake_case: front_default
    [JsonPropertyName("front_default")]
    public string? FrontDefault { get; set; }

    // Some Pokémon may have null front_default but other official artwork is present.
    // PokeAPI path: sprites.other.official-artwork.front_default
    public PokeApiOtherSprites? Other { get; set; }
}

public sealed class PokeApiOtherSprites
{
    // PokeAPI key: official-artwork
    [JsonPropertyName("official-artwork")]
    public PokeApiOfficialArtwork? OfficialArtwork { get; set; }
}

public sealed class PokeApiOfficialArtwork
{
    // PokeAPI key: front_default
    [JsonPropertyName("front_default")]
    public string? FrontDefault { get; set; }
}

public sealed class PokeApiTypeSlot
{
    public int Slot { get; set; }
    public PokeApiNamedResource Type { get; set; } = new();
}

public sealed class PokeApiNamedResource
{
    public string Name { get; set; } = "";
}
