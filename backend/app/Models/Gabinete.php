<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gabinete extends Model
{
    use HasFactory;

    protected $table = 'gabinete';
    protected $primaryKey = 'id_gabinete';

    protected $fillable = [
        'nome',
        //'responsavel',
        'contacto',
        'id_municipio',
        'id_responsavel',
    ];

    public function municipio()
    {
        return $this->belongsTo(Municipio::class, 'id_municipio', 'id_municipio');
    }

    public function responsavel()
    {
        return $this->belongsTo(Usuario::class, 'id_responsavel', 'id_usuario');
    }

    public function usuarios()
    {
        return $this->hasMany(Usuario::class, 'id_usuario', 'id_usuario');
    }
}
