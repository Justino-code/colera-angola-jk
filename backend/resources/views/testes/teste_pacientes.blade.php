<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <title>Teste PacienteController</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        input, select, button { margin: 5px 0; padding: 5px; width: 300px; }
        .section { margin-bottom: 30px; }
    </style>
</head>
<body>

    <h1>Teste PacienteController</h1>

    <div class="section">
        <h2>➕ Criar Paciente</h2>
        <form method="POST" action="/pacientes_test">
            @csrf
            <input type="text" name="nome" placeholder="Nome"><br>
            <input type="text" name="numero_bi" placeholder="Número BI"><br>
            <input type="text" name="telefone" placeholder="Telefone"><br>
            <input type="number" name="idade" placeholder="Idade" ><br>
            <select name="sexo" >
                <option value="">Selecione o sexo</option>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
            </select><br>
            <input type="text" name="sintomas[]" placeholder="Sintomas (separados por vírgula)" ><br>
            <input type="text" name="latitude" placeholder="Latitude"><br>
            <input type="text" name="longitude" placeholder="Longitude"><br>
            <button type="submit">Criar Paciente</button>
        </form>
    </div>

    <div class="section">
        <h2>🔍 Buscar Paciente</h2>
        <form method="GET" action="/paciente_test/show">
            <input type="number" name="id" placeholder="ID do Paciente" ><br>
            <button type="submit">Buscar</button>
        </form>
    </div>

    <div class="section">
        <h2>✏️ Atualizar Paciente</h2>
        <form method="POST" action="/paciente_test/update">
            @csrf
            <input type="number" name="id" placeholder="ID do Paciente" ><br>
            <input type="text" name="nome" placeholder="Novo Nome"><br>
            <input type="text" name="numero_bi" placeholder="Novo Número BI"><br>
            <input type="text" name="telefone" placeholder="Novo Telefone"><br>
            <input type="number" name="id_hospital" placeholder="Novo ID do Hospital"><br>
            <button type="submit">Atualizar</button>
        </form>
    </div>

    <div class="section">
        <h2>🗑 Excluir Paciente</h2>
        <form method="POST" action="/paciente_test/delete">
            @csrf
            <input type="number" name="id" placeholder="ID do Paciente"><br>
            <button type="submit">Excluir</button>
        </form>
    </div>

</body>
</html>
