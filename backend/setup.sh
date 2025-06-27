#!/bin/bash

echo "🚀 Iniciando o setup do projeto..."

# Instalar dependências PHP
echo "📦 Executando: composer install"
composer install

# Gerar chave da aplicação
echo "🔑 Executando: php artisan key:generate"
php artisan key:generate

# Rodar migrações
echo "🛠️ Executando: php artisan migrate"
php artisan migrate

# Rodar seeder do usuário
echo "🌱 Executando: php artisan db:seed --class=UsuarioSeeder"
php artisan db:seed --class=UsuarioSeeder

# Rodar seeder de Províncias e Municípios
echo "🌱 Executando: php artisan db:seed --class=ProvinciasMunicipiosSeeder"
php artisan db:seed --class=ProvinciasMunicipiosSeeder

# Criar link simbólico para o storage
echo "🔗 Executando: php artisan storage:link"
php artisan storage:link

echo "✅ Setup concluído com sucesso!"
