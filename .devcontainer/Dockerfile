# Dev container Dockerfile
# Base image with .NET 8 SDK
FROM mcr.microsoft.com/devcontainers/dotnet:1-8.0-jammy

# Install Node.js 18 (LTS) and pnpm
ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get update \
  && apt-get install -y curl ca-certificates gnupg2 lsb-release --no-install-recommends \
  && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
  && apt-get install -y nodejs --no-install-recommends \
  && npm install -g npm@11.7.0 pnpm@latest \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# Create a non-root vscode user if not present in base image
ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=$USER_UID
RUN if id -u $USERNAME 2>/dev/null; then echo "user exists"; else \
      groupadd --gid $USER_GID $USERNAME && \
      useradd --uid $USER_UID --gid $USER_GID -m $USERNAME && \
      echo "$USERNAME ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers; \
    fi

USER $USERNAME
ENV NPM_CONFIG_PREFIX=/home/$USERNAME/.npm-global
ENV PATH=/home/$USERNAME/.npm-global/bin:$PATH
