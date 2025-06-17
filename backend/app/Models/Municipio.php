<?php
// app/Models/Municipio.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Municipio extends Model {
    protected $table = 'municipio';
    protected $primaryKey = 'id_municipio';

    protected $fillable = ['nome', 'id_provincia'];

    public function provincia(): BelongsTo {
        return $this->belongsTo(Provincia::class, 'id_provincia', 'id_provincia');
    }

    public function hospitais(): HasMany {
        return $this->hasMany(Hospital::class, 'id_hospital', 'id_hospital');
    }
}
