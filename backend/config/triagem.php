<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Sintomas associados à cólera
    |--------------------------------------------------------------------------
    */
    'sintomas' => [
        'diarreia_aquosa'       => 'Diarreia aquosa profusa (em água de arroz)',
        'vomito'                => 'Vômito',
        'desidratacao'          => 'Sinais de desidratação',
        'cãibras_musculares'     => 'Cãibras musculares',
        'sede_excessiva'        => 'Sede excessiva',
        'olhos_fundos'          => 'Olhos fundos',
        'pele_retraida'         => 'Pele com perda de elasticidade',
        'fraqueza'              => 'Fraqueza extrema',
        'batimento_acelerado'   => 'Batimento cardíaco acelerado',
        'pressao_baixa'         => 'Pressão arterial baixa',
        'urinacao_reduzida'     => 'Diminuição da urina',
        'letargia'              => 'Letargia / sonolência',
    ],

    /*
    |--------------------------------------------------------------------------
    | Sintomas críticos para classificação de alto risco
    |--------------------------------------------------------------------------
    |
    | São sintomas que indicam desidratação grave ou risco iminente de choque hipovolêmico
    | e morte se não tratado rapidamente.
    |
    */
    'sintomasCriticos' => [
        'diarreia_aquosa',
        'desidratacao',
        'vomito',
        'pressao_baixa',
        'batimento_acelerado',
        'letargia',
        'urinacao_reduzida',
    ],

];
