<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Sintomas associados à cólera com pesos de risco
    |--------------------------------------------------------------------------
    |
    | Cada sintoma possui um peso que reflete sua importância na avaliação de risco.
    | Sintomas com peso maior contribuem mais para a pontuação total de risco.
    |
    */
    'sintomas' => [
        'diarreia_aquosa' => [
            'label' => 'Diarreia aquosa profusa (em água de arroz)',
            'peso' => 3
        ],
        'vomito' => [
            'label' => 'Vômito',
            'peso' => 2
        ],
        'desidratacao' => [
            'label' => 'Sinais de desidratação',
            'peso' => 3
        ],
        'cãibras_musculares' => [
            'label' => 'Cãibras musculares',
            'peso' => 1
        ],
        'sede_excessiva' => [
            'label' => 'Sede excessiva',
            'peso' => 1
        ],
        'olhos_fundos' => [
            'label' => 'Olhos fundos',
            'peso' => 2
        ],
        'pele_retraida' => [
            'label' => 'Pele com perda de elasticidade',
            'peso' => 2
        ],
        'fraqueza' => [
            'label' => 'Fraqueza extrema',
            'peso' => 1
        ],
        'batimento_acelerado' => [
            'label' => 'Batimento cardíaco acelerado',
            'peso' => 2
        ],
        'pressao_baixa' => [
            'label' => 'Pressão arterial baixa',
            'peso' => 3
        ],
        'urinacao_reduzida' => [
            'label' => 'Diminuição da urina',
            'peso' => 2
        ],
        'letargia' => [
            'label' => 'Letargia / sonolência',
            'peso' => 3
        ],
        'febre' => [
            'label' => 'Febre',
            'peso' => 1
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Combinações críticas de sintomas
    |--------------------------------------------------------------------------
    |
    | Estas combinações automaticamente classificam o paciente como alto risco,
    | independentemente da pontuação total.
    |
    */
    'combinacoes_criticas' => [
        ['diarreia_aquosa', 'vomito', 'desidratacao'],
        ['diarreia_aquosa', 'pressao_baixa'],
        ['desidratacao', 'letargia'],
        ['olhos_fundos', 'pele_retraida', 'urinacao_reduzida']
    ],

    /*
    |--------------------------------------------------------------------------
    | Limiares de classificação de risco
    |--------------------------------------------------------------------------
    |
    | Define os valores de corte para cada classificação de risco baseado na
    | pontuação total dos sintomas.
    |
    */
    'limiares_risco' => [
        'alto_risco' => 8,
        'medio_risco' => 5,
        // Abaixo de 5 é considerado baixo_risco
    ],

    /*
    |--------------------------------------------------------------------------
    | Protocolos por nível de risco
    |--------------------------------------------------------------------------
    |
    | Ações recomendadas para cada nível de risco identificado.
    |
    */
    'protocolos' => [
        'alto_risco' => [
            'Recomendação' => 'Encaminhamento imediato para unidade de emergência',
            'Prioridade' => 'Máxima (atendimento imediato)',
            'Ações' => [
                'Iniciar hidratação venosa imediatamente',
                'Monitorar sinais vitais a cada 15 minutos',
                'Coletar amostras para diagnóstico laboratorial'
            ]
        ],
        'medio_risco' => [
            'Recomendação' => 'Avaliação médica prioritária',
            'Prioridade' => 'Alta (atendimento em até 1 hora)',
            'Ações' => [
                'Iniciar terapia de reidratação oral',
                'Monitorar sinais vitais a cada 30 minutos',
                'Observar por sinais de deterioração'
            ]
        ],
        'baixo_risco' => [
            'Recomendação' => 'Avaliação clínica padrão',
            'Prioridade' => 'Normal (atendimento em até 4 horas)',
            'Ações' => [
                'Orientar sobre hidratação oral',
                'Monitorar evolução dos sintomas',
                'Retornar imediatamente se surgirem sinais de alerta'
            ]
        ]
    ]
];