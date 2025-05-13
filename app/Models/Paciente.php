<?php
// app/Models/Paciente.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Paciente extends Model {
    protected $table = 'paciente';
    protected $primaryKey = 'id_paciente';

    protected $fillable = [
        'nome', 'numero_bi', 'telefone', 'idade', 'sexo',
        'sintomas', 'resultado_triagem', 'qr_code', 'nome_hospital', 'id_hospital'
    ];

    protected $casts = [
        'sintomas' => 'array',
        'telefone' => 'encrypted', // Criptografia AES-256
        'resultado_triagem' => 'encrypted'
    ];

    public function hospital(): BelongsTo {
        return $this->belongsTo(Hospital::class);
    }
}
