<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gabinete extends Model
{
    use HasFactory;

    protected $table = 'gabinete';
    protected $table = 'id_gabinete';

    protected $fillable = [
        'nome',
        'responsavel',
        'contacto',
        'id_municipio',
    ];

    public function municipio()
    {
        return $this->belongsTo(Municipio::class);
    }

    public function usuarios()
    {
        return $this->hasMany(Usuario::class);
    }
}
