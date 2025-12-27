using System.Net;
using System.Text.Json;
using JustCatch.Backend.Models;

namespace JustCatch.Backend.Services;

public sealed class PokeApiClient : IPokeApiClient
{
    private readonly HttpClient _http;

    public PokeApiClient(HttpClient http)
    {
        _http = http;
    }

    public async Task<PokemonDetails?> GetPokemonAsync(int id, CancellationToken cancellationToken = default)
    {
        using var response = await _http.GetAsync($"pokemon/{id}", cancellationToken);
        if (response.StatusCode == HttpStatusCode.NotFound)
        {
            return null;
        }

        response.EnsureSuccessStatusCode();

        await using var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
        var dto = await JsonSerializer.DeserializeAsync<PokeApiPokemonResponse>(stream,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true }, cancellationToken);

        if (dto is null)
        {
            return null;
        }

        var imageUrl = dto.Sprites?.Other?.OfficialArtwork?.FrontDefault
                       ?? dto.Sprites?.FrontDefault;

        return new PokemonDetails(
            dto.Id,
            dto.Name,
            dto.BaseExperience,
            imageUrl,
            dto.Types?.OrderBy(t => t.Slot).Select(t => t.Type.Name).ToArray() ?? []);
    }
}
