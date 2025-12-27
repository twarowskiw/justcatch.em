# syntax=docker/dockerfile:1
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY src/JustCatch.Backend/JustCatch.Backend.csproj ./src/JustCatch.Backend/
RUN dotnet restore ./src/JustCatch.Backend/JustCatch.Backend.csproj

COPY . ./
RUN dotnet publish ./src/JustCatch.Backend/JustCatch.Backend.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish ./

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "JustCatch.Backend.dll"]
