<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <title>Criar Gabinete</title>
</head>
<body>
  <h1>Criar Gabinete</h1>

  <form action="/gabinetes_test" method="POST">
    <input type="hidden" name="_token" value="{{ csrf_token() }}"> 
    <div>
      <label for="nome">Nome:</label><br>
      <input type="text" id="nome" name="nome" required>
    </div>

    <div>
      <label for="id_municipio">ID Município:</label><br>
      <input type="number" id="id_municipio" name="id_municipio" required>
    </div>

    <div>
      <label for="id_responsavel">ID Responsável:</label><br>
      <input type="number" id="id_responsavel" name="id_responsavel">
    </div>

    <div>
      <label for="contacto">Contacto:</label><br>
      <input type="text" id="contacto" name="contacto">
    </div>

    <br>
    <button type="submit">Criar Gabinete</button>
  </form>
</body>
</html>
