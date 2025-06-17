#!/bin/bash

# Função para verificar e instalar pacotes necessários
install_package() {
  package=$1
  if ! dpkg -l | grep -q "$package"; then
    echo "Instalando $package..."
    sudo apt-get install -y $package
  else
    echo "$package já está instalado."
  fi
}

# Atualizar o sistema
echo "Atualizando o sistema..."
sudo apt update && sudo apt upgrade -y

# Instalar o PHP e as extensões
echo "Instalando PHP e extensões..."
sudo apt install -y php php-cli php-mysql php-curl php-json php-xml php-mbstring php-zip php-bcmath php-ldap php-soap php-intl php-gd php-imagick

# Verificar a versão do PHP
echo "PHP instalado: $(php -v)"

# Instalar o Node.js v24
echo "Instalando Node.js v24..."
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar a versão do Node.js
echo "Node.js instalado: $(node -v)"

# Instalar o Git (se necessário)
install_package git

# Gerar chave SSH
echo "Gerando chave SSH..."
if [ ! -f ~/.ssh/id_rsa ]; then
  ssh-keygen -t rsa -b 4096 -C "jkotingo25@gmail.com" -f ~/.ssh/id_rsa -N ""
else
  echo "Chave SSH já existente, pulando geração."
fi

# Adicionar chave SSH ao agente SSH
echo "Adicionando chave SSH ao agente..."
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_rsa

# Mostrar chave pública para adicionar no GitHub
echo "Sua chave pública SSH é:"
cat ~/.ssh/id_rsa.pub

echo "Por favor, copie e cole esta chave pública na sua conta do GitHub em Settings > SSH and GPG keys > New SSH key."

# Testar a conexão SSH com o GitHub
echo "Testando a conexão SSH com o GitHub..."
ssh -T git@github.com

echo "Instalação e configuração concluídas."
