FROM mcr.microsoft.com/vscode/devcontainers/base:debian-11

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive \
    apt-get install -y \
    fish \
    && rm -rf /var/lib/apt/lists/*

# Install node
RUN apt-get update \
    && DEBIAN_FRONTEND=noninteractive \
    apt-get install -y nodejs npm \
    && npm install -g n \
    && n latest \
    && DEBIAN_FRONTEND=noninteractive \
    apt-get remove -y nodejs npm \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g yarn
