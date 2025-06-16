<!DOCTYPE html>
<html lang="pt-PT">
<head>
    <meta charset="UTF-8">
    <title>Testes API - Usuário (Store & Update)</title>
    <style>
        body { font-family: sans-serif; padding: 20px; background: #f9f9f9; }
        h1 { color: #333; }
        .section { background: #fff; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 0 8px rgba(0,0,0,0.1); }
        label { display: block; margin-top: 10px; }
        input, select { width: 300px; padding: 5px; }
        button { margin-top: 10px; padding: 8px 16px; }
    </style>
</head>
<body>
    <h1>Testes de Usuário - Store & Update</h1>

    <div class="section">
        <h2>➕ Criar Usuário</h2>
        <form method="POST" action="/usuario_test">
            <input type="hidden" name="_token" value="{{ csrf_token() }}">

            <label>Nome</label>
            <input type="text" name="nome">

            <label>Email</label>
            <input type="email" name="email">

            <label>Password</label>
            <input type="password" name="password">

            <label>Confirmar Password</label>
            <input type="password" name="password_confirmation">

            <label>Role</label>
            <select name="role">
                <option value="gestor">Gestor</option>
                <option value="medico">Médico</option>
                <option value="tecnico">Técnico</option>
                <option value="enfermeiro">Enfermeiro</option>
                <option value="epidemiologista">Epidemiologista</option>
                <option value="administrativo">Administrativo</option>
                <option value="agente_sanitario">Agente Sanitário</option>
                <option value="farmaceutico">Farmacêutico</option>
                <option value="analista_dados">Analista de Dados</option>
                <option value="coordenador_regional">Coordenador Regional</option>
            </select>

            <label>Permissões</label>
            <select name="permissoes[]" multiple>
                <option value="gerenciar_usuarios">Gerenciar Usuários</option>
                <option value="ver_dashboard">Ver Dashboard</option>
                <option value="gerar_relatorios">Gerar Relatórios</option>
                <option value="editar_dados">Editar Dados</option>
                <option value="acessar_configuracoes">Acessar Configurações</option>
            </select>

            <label>Hospital</label>
            <input type="number" name="id_hospital">

            <button type="submit">Criar Usuário</button>
        </form>
    </div>

    <div class="section">
        <h2>✏ Atualizar Usuário</h2>
        <form method="POST" id="updateForm">
            <input type="hidden" name="_token" value="{{ csrf_token() }}">
            <input type="hidden" name="_method" value="POST">

            <label>ID do Usuário</label>
            <input type="number" name="id_usuario" id="id_usuario" required>

            <label>Nome</label>
            <input type="text" name="nome">

            <label>Email</label>
            <input type="email" name="email">

            <label>Password (deixe vazio para não alterar)</label>
            <input type="password" name="password">

            <label>Role</label>
            <select name="role">
                <option value="">-- Não alterar --</option>
                <option value="gestor">Gestor</option>
                <option value="medico">Médico</option>
                <option value="tecnico">Técnico</option>
                <option value="enfermeiro">Enfermeiro</option>
                <option value="epidemiologista">Epidemiologista</option>
                <option value="administrativo">Administrativo</option>
                <option value="agente_sanitario">Agente Sanitário</option>
                <option value="farmaceutico">Farmacêutico</option>
                <option value="analista_dados">Analista de Dados</option>
                <option value="coordenador_regional">Coordenador Regional</option>
            </select>

            <label>Permissões</label>
            <select name="permissoes[]" multiple>
                <option value="gerenciar_usuarios">Gerenciar Usuários</option>
                <option value="ver_dashboard">Ver Dashboard</option>
                <option value="gerar_relatorios">Gerar Relatórios</option>
                <option value="editar_dados">Editar Dados</option>
                <option value="acessar_configuracoes">Acessar Configurações</option>
            </select>

            <label>ID do Hospital</label>
            <input type="number" name="id_hospital">

            <button type="submit">Atualizar Usuário</button>
        </form>
    </div>

    <script>
        document.getElementById('updateForm').addEventListener('submit', function(e) {
            const id = document.getElementById('id_usuario').value;
            this.action = '/usuario_test/' + id;
        });
    </script>

</body>
</html>

