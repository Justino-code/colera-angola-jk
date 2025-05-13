<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\Municipio;
use App\Models\Provincia;

class MunicipioSeeder extends Seeder {
    public function run() {
        $provincia = Provincia::where('codigo_iso', 'LUA')->first(); // Luanda

        $municipios = [
            ['nome' => 'Belas'],
            ['nome' => 'Cacuaco'],
            ['nome' => 'Cazenga'],
            ['nome' => 'Ícolo e Bengo'],
            ['nome' => 'Luanda'],
            ['nome' => 'Quiçama'],
            ['nome' => 'Talatona'],
            ['nome' => 'Viana'],
        ];

        foreach ($municipios as $municipio) {
            $provincia->municipios()->create($municipio);
        }
    }
}
