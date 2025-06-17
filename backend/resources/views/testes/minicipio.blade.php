<!DOCTYPE html>
<html lang="pt-pt">
<head>
  <meta charset="UTF-8" />
  <title>Criar Município</title>
</head>
<body>
  <h1>Criar Município</h1>

  <form method="POST" action="/municipio_test">
    <!-- CSRF token (se for usar no Blade/Laravel diretamente) -->
     <input type="hidden" name="_token" value="{{ csrf_token() }}"> 

    <label for="nome">Nome do Município:</label><br>
    <input type="text" id="nome" name="nome" required><br><br>

    <label for="id_provincia">Província:</label><br>
    <select id="id_provincia" name="id_provincia" required>
      <option value="">Selecione a província</option>
      <option value="1">Bengo</option>
      <option value="2">Luanda</option>
      <option value="3">Huambo</option>
      <!-- Adicione outras províncias conforme necessário -->
    </select><br><br>

    <button type="submit">Criar</button>
  </form>
</body>
</html>
