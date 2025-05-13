<?php
// app/Models/Ambulancia.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Ambulancia extends Model {
    protected $table = 'ambulancia';
    protected $primaryKey = 'id_ambulancia';

    protected $fillable = [
        'placa', 'status', 'latitude', 'longitude', 'id_hospital'
    ];

    public function hospital(): BelongsTo {
        return $this->belongsTo(Hospital::class);
    }
}
