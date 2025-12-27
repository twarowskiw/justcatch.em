namespace JustCatch.Backend.Models;

public sealed record PokemonDetails(int Id, string Name, int BaseExperience, string? ImageUrl, string[] Types);
