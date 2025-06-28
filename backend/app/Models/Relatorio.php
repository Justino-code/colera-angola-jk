<?php
// app/Models/Relatorio.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Relatorio extends Model {
    protected $table = 'relatorio'; // Define o nome da tabela
    protected $primaryKey = 'id_relatorio'; // Define a chave primária
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
        return $this->belongsTo(Usuario::class, 'id_usuario', 'id_usuario');
    }
}
