using JustCatch.Backend.Models;
using Microsoft.Extensions.Caching.Memory;

namespace JustCatch.Backend.Services;

public sealed class PokemonService : IPokemonService
{
    private readonly IMemoryCache _cache;
    private readonly IPokeApiClient _pokeApi;

    public PokemonService(IMemoryCache cache, IPokeApiClient pokeApi)
    {
        _cache = cache;
        _pokeApi = pokeApi;
    }

    public async Task<PokemonDetails?> GetPokemonAsync(int id, CancellationToken cancellationToken = default)
    {
        if (id <= 0) return null;

        var cacheKey = $"pokeapi:pokemon:{id}";

        if (_cache.TryGetValue(cacheKey, out PokemonDetails? cached) && cached is not null)
        {
            return cached;
        }

        var pokemon = await _pokeApi.GetPokemonAsync(id, cancellationToken);
        if (pokemon is null)
        {
            return null;
        }

        _cache.Set(cacheKey, pokemon, new MemoryCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1)
        });

        return pokemon;
    }
}
