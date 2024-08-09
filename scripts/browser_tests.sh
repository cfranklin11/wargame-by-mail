#!/bin/bash

set -euo pipefail

ORIGINAL_DATABASE_URL=${DATABASE_URL:-""}
EXIT_CODE=0
export DATABASE_URL="postgresql://$DATABASE_USER:$DATABASE_PASSWORD@localhost:5432/test?schema=public"

trap log_errors err
trap clean_up exit

function log_errors() {
  EXIT_CODE=$?

  if [ "$CI" == "true" ]; then
    docker-compose ps
    docker-compose logs
  fi
}

function clean_up() {
  export DATABASE_URL=$ORIGINAL_DATABASE_URL

  exit ${EXIT_CODE}
}

docker-compose exec db psql -c "DROP DATABASE IF EXISTS test;" -U $DATABASE_USER
docker-compose exec db psql -c "CREATE DATABASE test;" -U $DATABASE_USER

PORT=7357 npm run test:e2e:local
