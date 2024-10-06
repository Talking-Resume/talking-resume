#!/bin/bash

# Ensure Docker Compose is installed
if ! [ -x "$(command -v docker-compose)" ]; then
  echo 'Error: docker-compose is not installed.' >&2
  exit 1
fi

# Run Docker Compose
docker-compose up --build