using JustCatch.Backend.Models;
using JustCatch.Backend.Services;
using Microsoft.AspNetCore.Http.HttpResults;

namespace JustCatch.Backend.Endpoints;

public static class TimeEndpoints
{
    public static IEndpointRouteBuilder MapTimeEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/time", async Task<Ok<TimeResponse>> (INtpTimeService timeService, CancellationToken ct) =>
            TypedResults.Ok(await timeService.GetTimeAsync(ct)))
            .WithName("GetTime");

        return app;
    }
}
