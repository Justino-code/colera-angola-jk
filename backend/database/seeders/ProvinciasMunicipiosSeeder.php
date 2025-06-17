<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProvinciasMunicipiosSeeder extends Seeder
{
    public function run(): void
    {
        $provincias = [
            ['nome' => 'Bengo', 'codigo_iso' => 'BGO'],
            ['nome' => 'Benguela', 'codigo_iso' => 'BGU'],
            ['nome' => 'Bié', 'codigo_iso' => 'BIE'],
            ['nome' => 'Cabinda', 'codigo_iso' => 'CAB'],
            ['nome' => 'Cuando Cubango', 'codigo_iso' => 'CCU'],
            ['nome' => 'Cuanza Norte', 'codigo_iso' => 'CNO'],
            ['nome' => 'Cuanza Sul', 'codigo_iso' => 'CSU'],
            ['nome' => 'Cunene', 'codigo_iso' => 'CNN'],
            ['nome' => 'Huambo', 'codigo_iso' => 'HUA'],
            ['nome' => 'Huíla', 'codigo_iso' => 'HUI'],
            ['nome' => 'Luanda', 'codigo_iso' => 'LUA'],
            ['nome' => 'Lunda Norte', 'codigo_iso' => 'LNO'],
            ['nome' => 'Lunda Sul', 'codigo_iso' => 'LSU'],
            ['nome' => 'Malanje', 'codigo_iso' => 'MAL'],
            ['nome' => 'Moxico', 'codigo_iso' => 'MOX'],
            ['nome' => 'Namibe', 'codigo_iso' => 'NAM'],
            ['nome' => 'Uíge', 'codigo_iso' => 'UIG'],
            ['nome' => 'Zaire', 'codigo_iso' => 'ZAI']
        ];

        $municipios = [
            'Bengo' => ['Caxito', 'Dande', 'Ambriz', 'Dembos'],
            'Benguela' => ['Benguela', 'Lobito', 'Baía Farta', 'Cubal'],
            'Bié' => ['Kuito', 'Andulo', 'Nharea'],
            'Cabinda' => ['Cabinda', 'Cacongo', 'Buco Zau'],
            'Cuando Cubango' => ['Menongue', 'Cuchi', 'Cuito Cuanavale'],
            'Cuanza Norte' => ['Ndalatando', 'Cambambe'],
            'Cuanza Sul' => ['Sumbe', 'Amboim', 'Cassongue'],
            'Cunene' => ['Ondjiva', 'Cahama'],
            'Huambo' => ['Huambo', 'Caála'],
            'Huíla' => ['Lubango', 'Chibia', 'Humpata'],
            'Luanda' => ['Luanda', 'Viana', 'Cacuaco', 'Belas'],
            'Lunda Norte' => ['Dundo', 'Cambulo'],
            'Lunda Sul' => ['Saurimo', 'Cacolo'],
            'Malanje' => ['Malanje', 'Cangandala'],
            'Moxico' => ['Luena', 'Camanongue'],
            'Namibe' => ['Moçâmedes', 'Tômbua'],
            'Uíge' => ['Uíge', 'Negage'],
            'Zaire' => ['Mbanza Congo', 'Soyo']
        ];

        foreach ($provincias as $prov) {
            $provinciaId = DB::table('provincia')->insertGetId([
                'nome' => $prov['nome'],
                'codigo_iso' => $prov['codigo_iso'],
                'created_at' => now(),
                'updated_at' => now()
            ]);

            if (isset($municipios[$prov['nome']])) {
                foreach ($municipios[$prov['nome']] as $mun) {
                    DB::table('municipio')->insert([
                        'nome' => $mun,
                        'id_provincia' => $provinciaId,
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);
                }
            }
        }
    }
}
