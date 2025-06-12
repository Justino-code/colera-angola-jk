<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Viatura extends Model
{
    use HasFactory;

    protected $table = 'viatura';
    protected $primaryKey = 'id_viatura';

    protected $fillable = [
        'identificacao',
        'tipo',
        'status',
        'latitude',
        'longitude',
        'id_hospital',
    ];

    public function hospital()
    {
        return $this->belongsTo(Hospital::class);
    }
}
