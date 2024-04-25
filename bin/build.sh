#!/bin/bash

# Entra na pasta bin
parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parent_path"

# Instala dependências
yarn

# Inicia a aplicação
yarn build