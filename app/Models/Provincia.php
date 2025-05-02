<?php
// app/Models/Provincia.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Provincia extends Model {
    protected $fillable = ['nome', 'codigo_iso'];

    public function municipios(): HasMany {
        return $this->hasMany(Municipio::class);
    }
}
