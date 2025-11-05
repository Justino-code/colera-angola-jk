# 🚰 Sistema de Gestão de Casos de Cólera em Angola  
![Logo do Sistema de Cólera Angola](assets/logo.svg)  
*Um sistema para triagem, monitoramento e encaminhamento de pacientes com sintomas de cólera, integrando hospitais, ambulâncias e gabinetes de saúde.*  

## 📌 Visão Geral  
Este sistema foi desenvolvido para apoiar o combate à cólera em Angola, facilitando:  
- **Triagem inteligente** de pacientes com sintomas de cólera.  
- **Encaminhamento automático** para hospitais mais próximos.  
- **Geração de QR Code** para identificação rápida de pacientes.  
- **Dashboards em tempo real** para monitoramento de casos por região.  
- **Relatórios estatísticos** para análise de surtos.  

## 🧩 Funcionalidades Principais  
- **Autenticação Segura**: Login com tokens JWT via Laravel Sanctum.  
- **Triagem de Pacientes**: Formulário com validação de sintomas e localização.  
- **Mapa Interativo**: Integração com Google Maps ou OpenStreetMap para localizar hospitais.  
- **QR Code Dinâmico**: Geração automática de QR com dados do paciente.  
- **Dashboard em Tempo Real**: Gráficos de casos por região (Chart.js).  
- **Relatórios PDF**: Exportação de dados para análise epidemiológica.  
- **Notificações em Tempo Real**: Alertas de novos casos para hospitais.  

## ⚙️ Tecnologias Utilizadas  
| Camada       | Tecnologia                     |  
|-------------|--------------------------------|  
| **Backend** | Laravel (PHP 8+, MySQL)        |  
| **Frontend**| React + JavaScript (Vite)      |  
| **API**     | RESTful + Laravel Sanctum      |  
| **Mapas**   | Google Maps API / React-Leaflet|  
| **Gráficos**| Chart.js                       |  
| **QR Code** | qrcode.react                   |  

## 📦 Estrutura do Projeto  
```
sistema-colera/  
├── backend/          # Laravel API  
│   ├── app/            # Models, Controllers, Requests  
│   ├── database/       # Migrations, Seeders  
│   ├── routes/         # API Routes  
│   └── .env            # Configurações do ambiente  
│  
├── frontend/         # React App  
│   ├── src/  
│   │   ├── components/ # Componentes reutilizáveis  
│   │   ├── pages/      # Telas principais (Login, Triagem, Dashboard)  
│   │   ├── services/   # Chamadas à API  
│   │   └── App.jsx     # Roteamento  
│   └── vite.config.js  # Configuração do Vite  
│  
├── assets/           # Arquivos estáticos (logo.svg)  
│   └── logo.svg      # Logotipo do sistema  
│  
└── README.md         # Este arquivo  
```  

## 🛠️ Instalação e Configuração  

### **1. Backend (Laravel)**  
```bash  
# Acesse a pasta do backend  
cd backend  

# Instale dependências  
composer install  

# Configure o .env  
cp .env.example .env  
php artisan key:generate  

# Configure o banco de dados no .env  
DB_CONNECTION=mysql  
DB_HOST=127.0.0.1  
DB_PORT=3306  
DB_DATABASE=colera_db  
DB_USERNAME=root  
DB_PASSWORD=senha  

# Crie o banco de dados e execute migrações  
php artisan migrate --seed  

# Inicie o servidor  
php artisan serve  
```  

### **2. Frontend (React)**  
```bash  
# Acesse a pasta do frontend  
cd frontend  

# Instale dependências  
npm install  

# Configure o proxy para a API Laravel  
# Edite vite.config.js e adicione:  
server: {  
  proxy: {  
    "/api": "http://localhost:8000"  
  }  
}  

# Inicie o servidor de desenvolvimento  
npm run dev  
```  

## 🧪 Exemplo de Uso  

### **1. Triagem de Paciente**  
1. Acesse a tela de triagem.  
2. Preencha os campos obrigatórios:  
   - Nome  
   - Telefone  
   - Sintomas (diarreia, vômito, febre, desidratação)  
   - Localização (latitude/longitude ou endereço)  
3. Envie o formulário.  
4. O sistema sugere hospitais próximos com vagas disponíveis.  

### **2. Mapa Interativo**  
- Hospitais são exibidos com marcadores.  
- Clique em um hospital para ver detalhes (vagas, distância).  

### **3. Dashboard**  
- Gráficos de casos por região.  
- Tendência de novos casos nas últimas 24 horas.  

## 📁 Endpoints da API  
| Método | Rota                  | Descrição                          |  
|--------|-----------------------|------------------------------------|  
| POST   | `/api/v1/triagem`     | Receber dados da triagem           |  
| GET    | `/api/v1/hospitais`   | Listar hospitais com vagas         |  
| POST   | `/api/v1/ambulancias` | Solicitar ambulância               |  
| GET    | `/api/v1/relatorios`  | Buscar dados para gráficos         |  

## 📝 Licença  
Este projeto está licenciado sob a **MIT License**. Veja o arquivo [LICENSE](LICENSE) para detalhes.  

## 👥 Contribuição  
Contribuições são bem-vindas! Para contribuir:  
1. Faça um fork do repositório.  
2. Crie uma branch com sua feature: `git checkout -b feature/nome-da-feature`.  
3. Commit suas mudanças: `git commit -m 'Adicionar feature'`.  
4. Push na branch: `git push origin feature/nome-da-feature`.  
5. Abra um Pull Request.  

## 📞 Contato  
**Autor:** [Justino]  
**Email:** jkotingo@gmail.com  
**GitHub:** [https://github.com/Justino-code/colera-angola-jk](https://github.com/Justino-code/colera-angola-jk)  

## 📸 Screenshots (Exemplo)  
- Tela de triagem:  
  ![Tela de Triagem](screenshots/triagem.png)  
- Mapa interativo:  
  ![Mapa](screenshots/mapa.png)  
- Dashboard:  
  ![Dashboard](screenshots/dashboard.png)  

🚀 **Pronto para salvar vidas em Angola!**  
Obrigado por contribuir para o combate à cólera! 🇦🇴💧  

