using JustCatch.Backend.Models;

namespace JustCatch.Backend.Services;

public interface IPokemonService
{
    Task<PokemonDetails?> GetPokemonAsync(int id, CancellationToken cancellationToken = default);
}
