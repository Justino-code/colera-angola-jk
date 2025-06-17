<?php
namespace App\Utils;

class GerarCodigoIso
{
    /**
     * Gera o código ISO (3 letras) a partir do nome da província.
     *
     * @param string $nome
     * @return string
     */
    public static function gerar(string $nome): string
    {
        // Remove acentos e transforma em maiúsculo
        $nomeLimpo = strtoupper(iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $nome));
        
        // Remove caracteres não alfabéticos (mantém espaço para nomes compostos)
        $nomeLimpo = preg_replace('/[^A-Z ]/', '', $nomeLimpo);

        $partes = preg_split('/\s+/', trim($nomeLimpo));

        if (count($partes) > 1) {
            // Se tiver mais de uma palavra, usa as iniciais
            $codigo = '';
            foreach ($partes as $parte) {
                if ($parte !== '') {
                    $codigo .= $parte[0];
                }
            }
            return str_pad(substr($codigo, 0, 3), 3, 'X');
        }

        // Nome único: pega os 3 primeiros caracteres
        return str_pad(substr($nomeLimpo, 0, 3), 3, 'X');
    }
}
