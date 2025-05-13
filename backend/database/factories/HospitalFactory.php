<?php
namespace Database\Factories;

use App\Models\Hospital;
use Illuminate\Database\Eloquent\Factories\Factory;

class HospitalFactory extends Factory
{
    protected $model = Hospital::class;

    public function definition()
    {
        return [
            'nome' => $this->faker->company,
            'latitude' => $this->faker->latitude,
            'longitude' => $this->faker->longitude,
            'capacidade_leitos' => rand(10, 100),
        ];
    }
}
