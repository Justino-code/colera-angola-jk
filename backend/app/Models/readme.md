# Sistema de Gestão e Monitoramento de Cólera em Angola

## Modelo de Dados

### Entidades Principais

#### 1. **Provincia**
- **Descrição**: Representa gabinetes provinciais de saúde.
- **Atributos**:
  - `id` (PK)
  - `nome`
  - `codigo_iso` (Código ISO único)

#### 2. **Municipio**
- **Descrição**: Subdivisão administrativa de uma província.
- **Atributos**:
  - `id` (PK)
  - `nome`
  - `provincia_id` (FK para `Provincia`)

#### 3. **Hospital**
- **Descrição**: Unidades de saúde (hospitais, centros médicos, etc.).
- **Atributos**:
  - `id` (PK)
  - `nome`
  - `tipo` (Geral, Municipal, Centro de Saúde, etc.)
  - `latitude`/`longitude` (geolocalização)
  - `municipio_id` (FK para `Municipio`)

#### 4. **Paciente**
- **Descrição**: Dados clínicos e demográficos dos pacientes.
- **Atributos**:
  - `telefone` e `resultado_triagem` (criptografados)
  - `sintomas` (JSON: ex: `["diarreia", "desidratação"]`)
  - `qr_code` (código único para identificação rápida)

#### 5. **Ambulancia**
- **Descrição**: Veículos de emergência com rastreamento em tempo real.
- **Atributos**:
  - `status` (disponível, em viagem, ocupada)
  - `latitude`/`longitude` (atualização dinâmica)

#### 6. **Usuario**
- **Descrição**: Gestores, médicos e técnicos do sistema.
- **Atributos**:
  - `role` (gestor, médico, técnico)
  - `permissoes` (JSON: ex: `["gerar_relatorios", "editar_pacientes"]`)

#### 7. **Relatorio**
- **Descrição**: Relatórios epidemiológicos gerados pelos usuários.
- **Atributos**:
  - `tipo` (casos_por_regiao, evolucao_temporal)
  - `dados` (JSON: ex: `{"regiao": "Luanda", "casos": 150}`)
  - `usuario_id` (FK para `Usuario`)

---

### Relacionamentos
| Entidade A       | Relacionamento | Entidade B       | Descrição                          |
|------------------|----------------|------------------|------------------------------------|
| Provincia        | 1:N            | Municipio        | Uma província tem vários municípios. |
| Municipio        | 1:N            | Hospital         | Um município tem vários hospitais. |
| Hospital         | 1:N            | Paciente         | Um hospital atende vários pacientes. |
| Hospital         | 1:N            | Ambulancia       | Um hospital possui várias ambulâncias. |
| Hospital         | 0:N            | Usuario          | Um hospital pode ter vários usuários vinculados. |
| Usuario          | 1:N            | Relatorio        | Um usuário pode gerar vários relatórios. |

---

### Diagrama de Entidade-Relacionamento (DER)
![DER](link_para_imagem_gerada_pelo_plantuml.png)

**Como gerar o diagrama**:
1. Copie o código PlantUML acima.
2. Cole em [PlantUML Editor](https://plantuml.com/plantuml-online) ou use uma extensão no VS Code.

---

### Considerações de Segurança
- **Criptografia**: Campos sensíveis (`telefone`, `resultado_triagem`) são armazenados com AES-256.
- **Autenticação**: JWT (tokens expirados + refresh tokens).
- **Controle de Acesso**: Permissões baseadas em roles (ex: médico só pode ver pacientes do seu hospital).

---

### Tecnologias Utilizadas
- **Back-end**: Laravel 10+ (PHP 8.3)
- **Front-end**: React.js + Google Maps API
- **Banco de Dados**: MySQL/PostgreSQL
- **Ferramentas**: Swagger (documentação), Postman (testes de API)

---

### Como Executar
1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/sistema-colerangola.git
