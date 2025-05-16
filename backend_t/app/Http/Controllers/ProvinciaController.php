<?php
namespace App\Http\Controllers;

use App\Models\Provincia;
use Illuminate\Http\Request;

class ProvinciaController extends Controller
{
    // Listar todas as províncias
    public function index()
    {
        return Provincia::all();
    }

    // Criar nova província
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'codigo_iso' => 'required|string|max:5|unique:provincia,codigo_iso'
        ]);

        $provincia = Provincia::create($validated);
        return response()->json($provincia, 201);
    }

    // Detalhes de uma província
    public function show($idProvincia)
    {
        return Provincia::findOrFail($idProvincia);
    }

    // Atualizar província
    public function update(Request $request, $idProvincia)
    {
        $provincia = Provincia::findOrFail($idProvincia);

        $validated = $request->validate([
            'nome' => 'sometimes|string|max:255',
            'codigo_iso' => 'sometimes|string|max:5|unique:provincia,codigo_iso,' . $idProvincia . ',id_provincia'
        ]);

        $provincia->update($validated);
        return response()->json($provincia);
    }

    // Excluir província
    public function destroy($idProvincia)
    {
        $provincia = Provincia::findOrFail($idProvincia);
        $provincia->delete();
        return response()->json(null, 204);
    }
}
