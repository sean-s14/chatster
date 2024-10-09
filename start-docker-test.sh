#!/bin/bash

# Function to check if a command exists
command_exists () {
    command -v "$1" >/dev/null 2>&1
}

# Check if Docker is installed
if ! command_exists docker; then
    echo "Docker is not installed. Please install Docker and try again."
    exit 1
fi

# Check if Docker Compose is installed
if ! command_exists docker-compose; then
    echo "Docker Compose is not installed. Please install Docker Compose and try again."
    exit 1
fi

# Files to look for
FILES=("docker-compose.yaml" "docker-compose.test.yaml")
MISSING_FILES=0

# Construct the docker-compose command with multiple -f options
DOCKER_COMPOSE_CMD="docker-compose"
for file in "${FILES[@]}"; do
    if [[ -f "$file" ]]; then
        DOCKER_COMPOSE_CMD+=" -f $file"
    else
        echo "Warning: File $file not found in the root directory."
        MISSING_FILES+=1
    fi
done

# Exit if any files are missing
if [[ $MISSING_FILES -gt 0 ]]; then
    echo "Aborting: One or more required files are missing."
    exit 1
fi

# Run the docker-compose command with up -d
echo "Starting docker-compose with the following command:"
echo "$DOCKER_COMPOSE_CMD up --build -d"
eval "$DOCKER_COMPOSE_CMD up --build -d"