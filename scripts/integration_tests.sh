#!/bin/bash


CI=${CI:-""}
ORIGINAL_DATABASE_URL=${DATABASE_URL:-""}
EXIT_CODE=0
export DATABASE_URL="postgresql://$DATABASE_USER:$DATABASE_PASSWORD@localhost:5432/test?schema=public"

if [ "$CI" == "true" ]; then
  set -euo pipefail
  trap log_errors err
fi
trap clean_up exit

function log_errors() {
  EXIT_CODE=$?

  docker-compose ps
  docker-compose logs
}

function clean_up() {
  export DATABASE_URL=$ORIGINAL_DATABASE_URL
  docker-compose exec db psql -c "DROP DATABASE IF EXISTS test;" -U $DATABASE_USER

  exit ${EXIT_CODE}
}

docker-compose exec db psql -c "CREATE DATABASE test;" -U $DATABASE_USER

if [ "$CI" == "true" ]; then
  npm run test:integration
else
  npm run test:setup

  while true; do
    read -p "Run an integration test: " test_command
    eval $test_command
  done
fi
