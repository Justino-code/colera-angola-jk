// app/Models/Paciente.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Paciente extends Model {
    protected $fillable = [
        'nome', 'bi_number', 'telefone', 'idade', 'sexo',
        'sintomas', 'resultado_triagem', 'qr_code', 'hospital_id'
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
