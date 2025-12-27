using JustCatch.Backend.Models;
using JustCatch.Backend.Services;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace JustCatch.Backend.Endpoints;

public static class TrainerEndpoints
{
    public static IEndpointRouteBuilder MapTrainerEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapPost("/api/trainer", Results<Created, BadRequest<ValidationProblemDetails>> (TrainerRequest request, ITrainerValidator validator) =>
            {
                var errors = validator.Validate(request);
                if (errors.Count > 0)
                {
                    return TypedResults.BadRequest(new ValidationProblemDetails(errors)
                    {
                        Title = "Validation failed"
                    });
                }

                return TypedResults.Created("/api/trainer");
            })
            .WithName("CreateTrainer");

        return app;
    }
}
