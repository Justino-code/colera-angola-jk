<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Gabinete;
use Illuminate\Http\Request;

class GabineteController extends Controller
{
    public function index()
    {
        return Gabinete::with('municipio')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'municipio_id' => 'required|exists:municipio,id_municipio',
            'responsavel' => 'nullable|string|max:255',
            'contacto' => 'nullable|string|max:20',
        ]);

        $gabinete = Gabinete::create($validated);
        return response()->json($gabinete, 201);
    }

    public function show($id)
    {
        return Gabinete::with('municipio')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $gabinete = Gabinete::findOrFail($id);

        $validated = $request->validate([
            'nome' => 'sometimes|string|max:255',
            'municipio_id' => 'sometimes|exists:municipio,id_municipio',
            'responsavel' => 'nullable|string|max:255',
            'contacto' => 'nullable|string|max:20',
        ]);

        $gabinete->update($validated);
        return response()->json($gabinete);
    }

    public function destroy($id)
    {
        Gabinete::destroy($id);
        return response()->json(['message' => 'Removido com sucesso.']);
    }
}
