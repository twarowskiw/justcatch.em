using JustCatch.Backend.Models;
using JustCatch.Backend.Services;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace JustCatch.Backend.Endpoints;

public static class PokemonEndpoints
{
    public static IEndpointRouteBuilder MapPokemonEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/pokemon",
                async Task<Results<Ok<PokemonDetails>, BadRequest<ProblemDetails>, NotFound<ProblemDetails>>> (int? id, IPokemonService pokemonService, CancellationToken ct) =>
                {
                    if (id is null || id <= 0)
                    {
                        return TypedResults.BadRequest(new ProblemDetails { Title = "id is required" });
                    }

                    var pokemon = await pokemonService.GetPokemonAsync(id.Value, ct);
                    if (pokemon is null)
                    {
                        return TypedResults.NotFound(new ProblemDetails { Title = "Pokémon not found" });
                    }

                    return TypedResults.Ok(pokemon);
                })
            .WithName("GetPokemon");

        return app;
    }
}
