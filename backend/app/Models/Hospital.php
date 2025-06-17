<?php
// app/Models/Hospital.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Hospital extends Model {
    protected $table = 'hospital';
    protected $primaryKey = 'id_hospital';

    protected $fillable = [
        'nome', 'tipo', 'endereco', 'latitude', 'longitude',
        'capacidade_leitos', 'id_municipio'
    ];

    public function municipio(): BelongsTo {
        return $this->belongsTo(Municipio::class, 'id_municipio', 'id_municipio');
    }

    public function pacientes(): HasMany {
        return $this->hasMany(Paciente::class, 'id_paciente', 'id_paciente');
    }

    public function ambulancias(): HasMany {
        return $this->hasMany(Ambulancia::class);
    }

    public function viaturas()
    {
        return $this->hasMany(Viatura::class, 'id_viatura', 'id_viatura');
    }

}
