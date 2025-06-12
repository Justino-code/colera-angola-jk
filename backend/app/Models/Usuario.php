<?php
// app/Models/User.php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;


class Usuario extends Authenticatable implements MustVerifyEmail{
    use HasApiTokens, Notifiable;

    protected $table = 'usuario';
    protected $primaryKey = 'id_usuario';


    protected $fillable = [
        'nome',
        'email',
        'password',
        'role',
        'permissoes',
        'id_hospital',
        'id_gabinete',
        'email_verified_at',
    ];

    protected $hidden = [
        'password',
        'remember_token'
    ];

    protected $casts = [
        'permissoes' => 'array',
        'email_verified_at' => 'datetime',
    ];

    public function hospital(): BelongsTo {
        return $this->belongsTo(Hospital::class);
    }

    public function relatorios() {
        return $this->hasMany(Relatorio::class);
    }

    public function gabinete()
    {
        return $this->belongsTo(Gabinete::class);
    }

}
