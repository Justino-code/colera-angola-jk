<?php
// app/Models/User.php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Usuario extends Authenticatable {
    protected $fillable = [
        'nome', 'email', 'password', 'role', 'permissoes', 'hospital_id'
    ];

    protected $hidden = ['password'];

    protected $casts = [
        'permissoes' => 'array'
    ];

    public function hospital(): BelongsTo {
        return $this->belongsTo(Hospital::class);
    }

    public function relatorios() {
        return $this->hasMany(Relatorio::class);
    }
}
