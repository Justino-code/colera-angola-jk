# 🦠 Backend API - Controle de Casos de Cólera

Este projeto é um backend desenvolvido em **Laravel 12**, que fornece uma **API RESTful** para registrar, consultar, atualizar e remover dados sobre casos de **cólera**. Criado com fins acadêmicos e educacionais.

---

## ✅ Tecnologias Utilizadas

- PHP 8.1+
- Laravel 12
- MySQL (ou SQLite)
- Laravel Sanctum (para autenticação via API Token)
- Composer

---

## ⚙️ Instalação e Configuração

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/colera-api.git
cd colera-api

# Instalar as dependências do Laravel
composer install

# Copiar arquivo de ambiente e gerar chave
cp .env.example .env
php artisan key:generate

# Configurar o banco de dados no arquivo .env
# Exemplo:
# DB_DATABASE=colera_db
# DB_USERNAME=root
# DB_PASSWORD=secret

# Rodar as migrações
php artisan migrate

# (Opcional) Iniciar o servidor local
php artisan serve
