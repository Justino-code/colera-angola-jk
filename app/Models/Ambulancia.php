<?php
// app/Models/Ambulancia.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Ambulancia extends Model {
    protected $fillable = [
        'placa', 'status', 'latitude', 'longitude', 'hospital_id'
    ];

    public function hospital(): BelongsTo {
        return $this->belongsTo(Hospital::class);
    }
}
