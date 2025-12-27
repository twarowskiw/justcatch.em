using JustCatch.Backend.Models;
using JustCatch.Backend.Services;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace JustCatch.Backend.Endpoints;

public static class SearchEndpoints
{
    public static IEndpointRouteBuilder MapSearchEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/search",
                Results<Ok<IReadOnlyList<SearchSuggestion>>, BadRequest<ProblemDetails>> (string? q, IPokemonCatalog catalog) =>
                {
                    if (string.IsNullOrWhiteSpace(q))
                    {
                        return TypedResults.BadRequest(new ProblemDetails
                        {
                            Title = "Query is required",
                            Detail = "Provide a non-empty q parameter."
                        });
                    }

                    return TypedResults.Ok(catalog.Search(q, limit: 10));
                })
            .WithName("SearchPokemon");

        return app;
    }
}
