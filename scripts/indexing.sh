#!/bin/bash -e

if [[ ! "${ALGOLIA_ADMIN_API_KEY}" ]];then
  echo "'ALGOLIA_ADMIN_API_KEY' is requried"
  exit 1
fi

if [[ ! "${GITHUB_TOKEN}" ]];then
  echo "'GITHUB_TOKEN' is requried"
  exit 1
fi

echo "Create index items..."

SCRIPT_DIR=$( cd "$( dirname "$0" )" && pwd )
ALGOLIA_API_KEY="${ALGOLIA_ADMIN_API_KEY}" bundle exec jekyll algolia --config "${SCRIPT_DIR}/../_config.yml,${SCRIPT_DIR}/../_config_production.yml"
