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
        $request->validate([
            'nome' => 'required|string|max:255',
            'codigo_iso' => 'required|string|max:5|unique:provinces'
        ]);

        return Provincia::create($request->all());
    }

    // Detalhes de uma província
    public function show(Provincia $provincia)
    {
        return $provincia;
    }

    // Atualizar província
    public function update(Request $request, Provincia $provincia)
    {
        $request->validate([
            'nome' => 'sometimes|string|max:255',
            'codigo_iso' => 'sometimes|string|max:5|unique:provinces,codigo_iso,'.$provincia->id
        ]);

        $provincia->update($request->all());
        return $provincia;
    }

    // Excluir província
    public function destroy(Provincia $provincia)
    {
        $provincia->delete();
        return response()->json(null, 204);
    }
}
