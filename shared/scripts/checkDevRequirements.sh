#!/usr/bin/env bash
set -eo pipefail

[[ $(command -v brew) ]] && [[ -f $(brew --prefix nvm)/nvm.sh ]] && source $(brew --prefix nvm)/nvm.sh
[[ -s ~/.nvm/nvm.sh ]] && . ~/.nvm/nvm.sh --no-use
unset PREFIX

if [[ ! $(command -v nvm) ]]; then
  echo "You don't have NVM installed, please install NVM."
  echo https://github.com/nvm-sh/nvm
  exit 1
fi
if [[ ! $(command -v yarn) ]]; then
  echo "You don't have yarn installed, please install yarn."
  echo https://yarnpkg.com/lang/en/docs/cli/install
  exit 1
fi
if [[ ! $(command -v docker) ]]; then
  echo "You don't have docker installed, please install the docker app."
  echo https://download.docker.com/mac/stable/Docker.dmg
  exit 1
fi
if [[ ! $(command -v docker-compose) ]]; then
  echo
  echo "You don't have docker-compose installed, please install docker-compose."
  echo https://docs.docker.com/compose/install
  echo
fi
