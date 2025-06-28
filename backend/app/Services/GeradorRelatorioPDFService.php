<?php
namespace App\Services;

use App\Models\Relatorio;
use Barryvdh\DomPDF\Facade\Pdf;

class GeradorRelatorioPDFService
{
    public function gerarPDF(Relatorio $relatorio): string
    {
        // Ensure $dadosArray is a plain array
        $dadosArray = is_array($relatorio->dados) ? $relatorio->dados : (array) $relatorio->dados;

        $html = $this->gerarHtml($relatorio->tipo, $dadosArray);

        return Pdf::loadHTML($html)->output();
    }

    private function gerarHtml(string $tipo, array $dados): string
    {
        // Remove o wrapper se for array numérico com 1 elemento associativo
        if (
            array_keys($dados) === range(0, count($dados) - 1) &&
            count($dados) === 1 &&
            is_array($dados[0])
        ) {
            $dados = $dados[0];
        }

        $html = '
        <html><head><style>
            body { font-family: Arial, sans-serif; }
            h1 { color: #333; }
            table { border-collapse: collapse; width: 100%; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; vertical-align: top; }
            th { background-color: #f2f2f2; }
            pre { margin: 0; font-size: 12px; font-family: monospace; }
        </style></head><body>
            <h1>Relatório: ' . htmlspecialchars($tipo) . '</h1>
            <table><thead><tr><th>Chave</th><th>Valor</th></tr></thead><tbody>';

        foreach ($dados as $key => $value) {
            $html .= '<tr><td>' . htmlspecialchars($key) . '</td><td>' .
                (is_array($value) || is_object($value)
                    ? '<pre>' . htmlspecialchars(json_encode($value, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) . '</pre>'
                    : htmlspecialchars($value)
                ) .
                '</td></tr>';
        }

        $html .= '</tbody></table></body></html>';
        return $html;
    }
}
