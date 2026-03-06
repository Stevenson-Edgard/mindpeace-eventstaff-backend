#!/bin/bash
# Start the backend server with environment variables loaded from the project root .env
set -e
cd "$(dirname "$0")"
node server/index.ts
