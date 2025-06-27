<?php

namespace App\Http\Controllers;

use App\Models\Relatorio;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Barryvdh\DomPDF\Facade\Pdf;

class RelatorioController extends Controller
{
    // Listar relatórios do usuário logado
    public function index(): JsonResponse
    {
        try {
            $this->authorize('viewAny', Relatorio::class);
            
            $relatorios = auth()->user()->relatorios;

            return response()->json([
                'success' => true,
                'data' => $relatorios
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao listar relatórios: ' . $e->getMessage()
            ], 500);
        }
    }

    // Gerar relatório em PDF
   public function generatePDF(Request $request): JsonResponse
{
    try {
        $this->authorize('create', Relatorio::class);

        $validator = Validator::make($request->all(), [
            'tipo' => 'required|in:casos_por_regiao,evolucao_temporal,distribuicao_demografica,outro',
            'dados' => 'required|json'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();

        $relatorio = Relatorio::create([
            'tipo' => $validated['tipo'],
            'dados' => $validated['dados'],
            'id_usuario' => auth()->id()
        ]);

        $dadosArray = json_decode($relatorio->dados, true);

        // Montar o HTML do relatório para o PDF
        $html = '
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; }
                    h1 { color: #333; }
                    table { border-collapse: collapse; width: 100%; margin-top: 20px; }
                    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                </style>
            </head>
            <body>
                <h1>Relatório: ' . htmlspecialchars($relatorio->tipo) . '</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Chave</th>
                            <th>Valor</th>
                        </tr>
                    </thead>
                    <tbody>';

        // Percorre o array e monta linhas da tabela
        foreach ($dadosArray as $key => $value) {
            $html .= '<tr><td>' . htmlspecialchars($key) . '</td><td>' . htmlspecialchars(is_array($value) ? json_encode($value) : $value) . '</td></tr>';
        }

        $html .= '
                    </tbody>
                </table>
            </body>
            </html>
        ';

        $pdf = Pdf::loadHTML($html);

        return response()->json([
            'success' => true,
            'file' => base64_encode($pdf->output())
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => 'Erro ao gerar PDF: ' . $e->getMessage()
        ], 500);
    }
}


    // Excluir relatório
    public function destroy(Relatorio $relatorio): JsonResponse
    {
        try {
            $this->authorize('delete', $relatorio);

            $relatorio->delete();

            return response()->json([
                'success' => true,
                'message' => 'Relatório removido com sucesso.'
            ]);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Acesso negado: ' . $e->getMessage()
            ], 403);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao remover relatório: ' . $e->getMessage()
            ], 500);
        }
    }
}

