#! /bin/bash
docker compose up -d

# Create .env file
echo "AUTH_SECRET='$(openssl rand -base64 32)'" > ./services/frontend/.env
echo "Visite http://localhost:8000"