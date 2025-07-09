<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AvaliacaoRisco extends Model
{
    protected $table = 'avaliacao_riscos'; // Nome da tabela
    protected $primaryKey = 'id_avaliacao'; // Chave primária

    protected $fillable = [
        'sintomas', // Sintomas informados pelo paciente (JSON)
        'resultado', // Resultado da avaliação (JSON)
        'id_paciente', // ID do paciente avaliado
        'id_usuario', // ID do usuário que fez a avaliação (opcional)
    ];

    protected $casts = [
        'resultado' => 'encrypted' // Criptografia AES-256 para o resultado
    ];

    // Relacionamento com o modelo Paciente
    public function paciente()
    {
        return $this->belongsTo(Paciente::class, 'id_paciente', 'id_paciente');
    }

    // Relacionamento com o modelo Usuario
    // Este relacionamento é opcional, usado para registrar quem fez a avaliação
    // Pode ser um médico, enfermeiro ou gestor ou um administrador
    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario', 'id_usuario');
    }
}
