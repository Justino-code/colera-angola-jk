<?php
namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\Provincia;

class ProvinciaSeeder extends Seeder {
    public function run() {
        $provincias = [
            ['nome' => 'Luanda', 'codigo_iso' => 'LUA'],
            ['nome' => 'Bengo', 'codigo_iso' => 'BGO'],
            ['nome' => 'Benguela', 'codigo_iso' => 'BGU'],
            ['nome' => 'Bié', 'codigo_iso' => 'BIE'],
            ['nome' => 'Cabinda', 'codigo_iso' => 'CAB'],
            ['nome' => 'Cuando-Cubango', 'codigo_iso' => 'CCU'],
            ['nome' => 'Cuanza Norte', 'codigo_iso' => 'CNO'],
            ['nome' => 'Cuanza Sul', 'codigo_iso' => 'CSU'],
            ['nome' => 'Cunene', 'codigo_iso' => 'CUN'],
            ['nome' => 'Huambo', 'codigo_iso' => 'HUA'],
            ['nome' => 'Huíla', 'codigo_iso' => 'HUI'],
            ['nome' => 'Lunda Norte', 'codigo_iso' => 'LNO'],
            ['nome' => 'Lunda Sul', 'codigo_iso' => 'LSU'],
            ['nome' => 'Malanje', 'codigo_iso' => 'MAL'],
            ['nome' => 'Moxico', 'codigo_iso' => 'MOX'],
            ['nome' => 'Namibe', 'codigo_iso' => 'NAM'],
            ['nome' => 'Uíge', 'codigo_iso' => 'UIG'],
            ['nome' => 'Zaire', 'codigo_iso' => 'ZAI'],
        ];

        foreach ($provincias as $provincia) {
            Provincia::create($provincia);
        }
    }
}
