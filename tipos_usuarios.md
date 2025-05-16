### **Tipos de Usuários e Permissões**

#### **1. Gestor de Saúde**  
- **Descrição**: Responsável pela gestão global do sistema e tomada de decisões estratégicas.  
- **Permissões**:  
  - Cadastrar/editar/excluir **Gabinetes Provinciais** e **Municipais**.  
  - Cadastrar/editar/excluir **hospitais** e **pontos de atendimento**.  
  - Acessar todos os dados do sistema (casos, relatórios, ambulâncias).  
  - Gerar relatórios epidemiológicos em PDF.  
  - Gerenciar permissões de outros usuários (médicos, técnicos).  
  - Visualizar **dashboard completo** em tempo real.  

---

#### **2. Médico**  
- **Descrição**: Atua diretamente no atendimento clínico e triagem de pacientes.  
- **Permissões**:  
  - Cadastrar/editar **pacientes** (incluindo fichas clínicas).  
  - Realizar **triagem inteligente** com base em sintomas.  
  - Encaminhar pacientes para hospitais via **geolocalização**.  
  - Visualizar apenas dados do **hospital vinculado**.  
  - Gerar QR Codes de pacientes.  
  - Acessar histórico de pacientes atendidos.  

---

#### **3. Técnico de Saúde**  
- **Descrição**: Responsável por atividades operacionais e logísticas.  
- **Permissões**:  
  - Cadastrar/rastrear **ambulâncias** e veículos hospitalares.  
  - Atualizar status de ambulâncias (**disponível/em viagem/ocupada**).  
  - Visualizar mapa de ambulâncias em tempo real.  
  - Cadastrar pontos de atendimento emergenciais.  
  - Acessar dados básicos de pacientes (sem informações sensíveis).  

---

### **Regras Específicas**
1. **Controle de Acesso por Hospital**:  
   - Médicos e técnicos só podem interagir com recursos vinculados ao seu hospital.  
   - Gestores têm acesso a todos os hospitais.  

2. **Criptografia de Dados Sensíveis**:  
   - Campos como `telefone` e `resultado_triagem` são visíveis apenas para **médicos** e **gestores**.  

3. **Auditoria**:  
   - Todas as ações críticas (exclusão de dados, alteração de permissões) são registradas em logs.
