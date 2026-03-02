#!/bin/bash
# Start the backend server with environment variables loaded from the project root .env
cd "$(dirname "$0")/server"
node index.ts
