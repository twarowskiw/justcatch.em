using JustCatch.Backend.Endpoints;
using JustCatch.Backend.Infrastructure;
using JustCatch.Backend.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCorsFromTraefik();

builder.Services.AddMemoryCache();

builder.Services.AddPokemonCatalogFromAssets();

builder.Services.AddPokeApiClientFromEnv();
builder.Services.AddSingleton<IPokemonService, PokemonService>();

builder.Services.AddSingleton<INtpTimeService, NtpTimeService>();

builder.Services.AddSingleton<ITrainerValidator, TrainerValidator>();

var app = builder.Build();

app.UseCors();

if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

app.MapTimeEndpoints();
app.MapSearchEndpoints();
app.MapPokemonEndpoints();
app.MapTrainerEndpoints();

app.Run();

public partial class Program { }
