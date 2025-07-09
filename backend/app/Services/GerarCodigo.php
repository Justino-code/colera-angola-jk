<?php
// filepath: c:\Users\franc\.jc\colera-angola-jk\backend\app\Services\GeradorCodigo.php

namespace App\Services;

use Illuminate\Support\Str;

class GerarCodigo
{

    /**
     * Gera um código único para qualquer modelo.
     * Exemplo de uso: GeradorCodigo::gerarCodigo(Paciente::class, 'PAC')
     *
     * @param string $modelClass Classe do modelo Eloquent (ex: Paciente::class)
     * @param string $prefix Prefixo do código (ex: 'PAC')
     * @param int $randomLength Quantidade de caracteres aleatórios (default: 4)
     * @return string
     */
    public static function gerarCodigo(string $modelClass, string $prefix, int $randomLength = 4): string
    {
        try{
        $date = date('ymd');
        $codigoPrefix = $prefix . '-' . $date . '-';
        do {
            $codigo = $codigoPrefix . Str::upper(Str::random($randomLength));
        } while ($modelClass::where('codigo', $codigo)->exists());

        return $codigo;
    }
        catch(\Exception $e) {
            // Log the error or handle it as needed
            throw new \RuntimeException("Erro ao gerar código: " . $e->getMessage());
        }
    }
}