namespace JustCatch.Backend.Infrastructure;

using JustCatch.Backend.Services;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddCorsFromTraefik(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddDefaultPolicy(policy =>
            {
                policy.WithOrigins("http://localhost:3000")
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
        });

        return services;
    }

    public static IServiceCollection AddPokeApiClientFromEnv(this IServiceCollection services)
    {
        services.AddHttpClient<IPokeApiClient, PokeApiClient>((_, client) =>
        {
            var baseUrl = Environment.GetEnvironmentVariable("POKEAPI_BASE_URL") ?? "https://pokeapi.co/api/v2";
            client.BaseAddress = new Uri(baseUrl.EndsWith('/') ? baseUrl : baseUrl + "/");
            client.Timeout = TimeSpan.FromSeconds(10);
            client.DefaultRequestHeaders.UserAgent.ParseAdd("justcatch.em/1.0");
        });

        return services;
    }

    public static IServiceCollection AddPokemonCatalogFromAssets(this IServiceCollection services)
    {
        services.AddSingleton<IPokemonCatalog>(sp =>
        {
            var env = sp.GetRequiredService<IHostEnvironment>();
            var logger = sp.GetRequiredService<ILogger<PokemonCatalog>>();

            var assetPath = Path.Combine(AppContext.BaseDirectory, "assets", "pokemon.json");
            if (!File.Exists(assetPath))
            {
                assetPath = Path.Combine(env.ContentRootPath, "assets", "pokemon.json");
            }

            logger.LogInformation("Loading pokemon catalog from {Path}", assetPath);
            return PokemonCatalog.LoadFromFile(assetPath);
        });

        return services;
    }
}
