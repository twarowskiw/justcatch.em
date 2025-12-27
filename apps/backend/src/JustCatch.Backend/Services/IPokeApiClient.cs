using JustCatch.Backend.Models;

namespace JustCatch.Backend.Services;

public interface IPokeApiClient
{
    Task<PokemonDetails?> GetPokemonAsync(int id, CancellationToken cancellationToken = default);
}
