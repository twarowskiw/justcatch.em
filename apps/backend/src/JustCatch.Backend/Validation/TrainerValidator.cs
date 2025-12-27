using JustCatch.Backend.Models;

namespace JustCatch.Backend.Services;

public sealed class TrainerValidator : ITrainerValidator
{
    private readonly IPokemonCatalog _catalog;

    public TrainerValidator(IPokemonCatalog catalog)
    {
        _catalog = catalog;
    }

    public Dictionary<string, string[]> Validate(TrainerRequest request)
    {
        var errors = new Dictionary<string, string[]>();

        if (string.IsNullOrWhiteSpace(request.Name) || request.Name.Trim().Length < 2 || request.Name.Trim().Length > 20)
        {
            errors["name"] = ["Name must be 2-20 characters."];
        }

        if (request.Age < 16 || request.Age > 99)
        {
            errors["age"] = ["Age must be between 16 and 99."];
        }

        if (request.PokemonId <= 0)
        {
            errors["pokemonId"] = ["PokemonId is required."];
            return errors;
        }

        var match = _catalog.GetById(request.PokemonId);
        if (match is null)
        {
            errors["pokemonId"] = ["Unknown PokemonId."];
            return errors;
        }

        if (string.IsNullOrWhiteSpace(request.PokemonName))
        {
            errors["pokemonName"] = ["PokemonName is required."];
            return errors;
        }

        if (!string.Equals(match.Name, request.PokemonName.Trim(), StringComparison.OrdinalIgnoreCase))
        {
            errors["pokemonName"] = ["PokemonName must match PokemonId."];
        }

        return errors;
    }
}
