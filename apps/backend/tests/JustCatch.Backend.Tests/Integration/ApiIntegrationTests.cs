using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using JustCatch.Backend.Models;
using JustCatch.Backend.Services;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace JustCatch.Backend.Tests.Integration;

public sealed class ApiIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public ApiIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task GetTime_ReturnsOk()
    {
        // Avoid real NTP access in tests.
        var factory = _factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                services.RemoveAll<INtpTimeService>();
                services.AddSingleton<INtpTimeService>(new FakeNtpTimeService());
            });
        });

        var client = factory.CreateClient();

        var resp = await client.GetAsync("/api/time");

        resp.StatusCode.Should().Be(HttpStatusCode.OK);

        var body = await resp.Content.ReadFromJsonAsync<TimeResponse>();
        body.Should().NotBeNull();
        body!.Source.Should().Be("fake-ntp");
    }

    [Fact]
    public async Task GetSearch_WithQuery_ReturnsResults()
    {
        var client = _factory.CreateClient();

        var resp = await client.GetAsync("/api/search?q=pika");

        resp.StatusCode.Should().Be(HttpStatusCode.OK);

        var items = await resp.Content.ReadFromJsonAsync<List<SearchSuggestion>>();
        items.Should().NotBeNull();
        items!.Count.Should().BeGreaterThan(0);
    }

    [Fact]
    public async Task PostTrainer_WithValidPayload_Returns201()
    {
        var client = _factory.CreateClient();

        // Use a known starter from pokemon.json.
        var payload = new TrainerRequest("Ash", 16, 25, "pikachu");

        var resp = await client.PostAsJsonAsync("/api/trainer", payload);

        resp.StatusCode.Should().Be(HttpStatusCode.Created);
    }

    [Fact]
    public async Task PostTrainer_WithInvalidPayload_Returns400_WithFieldErrors()
    {
        var client = _factory.CreateClient();

        var payload = new TrainerRequest("A", 10, 0, "");

        var resp = await client.PostAsJsonAsync("/api/trainer", payload);

        resp.StatusCode.Should().Be(HttpStatusCode.BadRequest);

        var body = await resp.Content.ReadFromJsonAsync<ValidationProblemDetailsDto>();
        body.Should().NotBeNull();
        body!.Errors.Should().ContainKey("name");
        body.Errors.Should().ContainKey("age");
        body.Errors.Should().ContainKey("pokemonId");
    }

    [Fact]
    public async Task PostTrainer_WithUnknownPokemonId_Returns400()
    {
        var client = _factory.CreateClient();

        var payload = new TrainerRequest("Ash", 16, 999999, "does-not-matter");

        var resp = await client.PostAsJsonAsync("/api/trainer", payload);
        resp.StatusCode.Should().Be(HttpStatusCode.BadRequest);

        var body = await resp.Content.ReadFromJsonAsync<ValidationProblemDetailsDto>();
        body.Should().NotBeNull();
        body!.Errors.Should().ContainKey("pokemonId");
    }

    [Fact]
    public async Task PostTrainer_WithPokemonNameMismatch_Returns400()
    {
        var client = _factory.CreateClient();

        // 25 -> pikachu
        var payload = new TrainerRequest("Ash", 16, 25, "bulbasaur");

        var resp = await client.PostAsJsonAsync("/api/trainer", payload);
        resp.StatusCode.Should().Be(HttpStatusCode.BadRequest);

        var body = await resp.Content.ReadFromJsonAsync<ValidationProblemDetailsDto>();
        body.Should().NotBeNull();
        body!.Errors.Should().ContainKey("pokemonName");
    }

    [Fact]
    public async Task GetPokemon_WithBadId_Returns400()
    {
        var client = _factory.CreateClient();

        var resp = await client.GetAsync("/api/pokemon?id=0");
        resp.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task GetPokemon_WhenNotFound_Returns404()
    {
        var factory = _factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                services.RemoveAll<IPokemonService>();
                services.AddSingleton<IPokemonService>(new FakePokemonService(returnNull: true));
            });
        });

        var client = factory.CreateClient();

        var resp = await client.GetAsync("/api/pokemon?id=514");
        resp.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task GetPokemon_WhenFound_Returns200_WithBody()
    {
        var factory = _factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                services.RemoveAll<IPokemonService>();
                services.AddSingleton<IPokemonService>(new FakePokemonService(returnNull: false));
            });
        });

        var client = factory.CreateClient();

        var resp = await client.GetAsync("/api/pokemon?id=514");
        resp.StatusCode.Should().Be(HttpStatusCode.OK);

        var body = await resp.Content.ReadFromJsonAsync<PokemonDetails>();
        body.Should().NotBeNull();
        body!.Id.Should().Be(514);
        body.Name.Should().Be("simisear");
        body.BaseExperience.Should().BeGreaterThan(0);
        body.ImageUrl.Should().NotBeNullOrWhiteSpace();
        body.Types.Should().Contain("fire");
    }

    private sealed class ValidationProblemDetailsDto
    {
        public Dictionary<string, string[]> Errors { get; set; } = new();
    }

    private sealed class FakeNtpTimeService : INtpTimeService
    {
        public Task<TimeResponse> GetTimeAsync(CancellationToken cancellationToken = default)
            => Task.FromResult(new TimeResponse(new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc), "fake-ntp"));
    }

    private sealed class FakePokemonService(bool returnNull) : IPokemonService
    {
        public Task<PokemonDetails?> GetPokemonAsync(int id, CancellationToken cancellationToken = default)
        {
            if (returnNull) return Task.FromResult<PokemonDetails?>(null);

            return Task.FromResult<PokemonDetails?>(new PokemonDetails(
                id,
                "simisear",
                174,
                "https://example.test/simisear.png",
                ["fire"]));
        }
    }
}
