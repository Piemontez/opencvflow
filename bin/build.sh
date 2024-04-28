#!/bin/bash

# Entra na pasta bin
parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parent_path"

# Dependências
echo 'Instalando dependências'
yarn

# Build
echo 'Buildando aplicação'
yarn build