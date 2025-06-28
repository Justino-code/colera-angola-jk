<?php
namespace App\Services;

use App\Models\Relatorio;

class RelatorioService
{
    public function criarRelatorio(int $userId, string $tipo, string $dados): Relatorio | array | string | null
    {
        return Relatorio::create([
            'tipo' => $tipo,
            'dados' => $dados, // Salva como array),
            'id_usuario' => $userId
        ]);
    }

    public function obterRelatorio(int $id): ?Relatorio
    {
        return Relatorio::find($id);
    }
}
