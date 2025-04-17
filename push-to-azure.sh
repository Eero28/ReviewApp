#!/bin/bash

echo "Logging in to Azure Container Registry..."
az acr login --name reviewappregistry

echo "Building images using Docker Compose..."
docker-compose build

echo "Tagging API service..."
docker tag reviewapp-api:latest reviewappregistry.azurecr.io/api:latest

echo "Tagging Expo service..."
docker tag reviewapp-expo:latest reviewappregistry.azurecr.io/expo:latest

echo "Pushing API image to ACR..."
docker push reviewappregistry.azurecr.io/api:latest

echo "Pushing Expo image to ACR..."
docker push reviewappregistry.azurecr.io/expo:latest

echo "Tagging and pushing completed!"
