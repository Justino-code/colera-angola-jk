<?php
// app/Models/Municipio.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Municipio extends Model {
    protected $fillable = ['nome', 'provincia_id'];

    public function provincia(): BelongsTo {
        return $this->belongsTo(Provincia::class);
    }

    public function hospitais(): HasMany {
        return $this->hasMany(Hospital::class);
    }
}
