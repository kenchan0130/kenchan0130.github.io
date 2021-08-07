#!/bin/bash -e

if [[ ! "${ALGOLIA_ADMIN_API_KEY}" ]];then
  echo "'ALGOLIA_ADMIN_API_KEY' is requried"
  exit 1
fi

echo "Create index items..."

script_dir=$( cd "$( dirname "$0" )" && pwd )
ALGOLIA_API_KEY="${ALGOLIA_ADMIN_API_KEY}" bundle exec jekyll algolia --config "${script_dir}/../_config.yml,${script_dir}/../_config_production.yml"
