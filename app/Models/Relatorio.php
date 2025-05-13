<?php
// app/Models/Relatorio.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Relatorio extends Model {
    protected $fillable = [
        'tipo',
        'dados',
        'id_usuario'
    ];

    protected $casts = [
        'dados' => 'encrypted:array', // Converte automaticamente JSON para array
        'data_geracao' => 'datetime'
    ];

    // Relacionamento com o usuário que gerou o relatório
    public function usuario(): BelongsTo {
        return $this->belongsTo(User::class);
    }
}
