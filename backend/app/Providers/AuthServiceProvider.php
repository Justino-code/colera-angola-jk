<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;

// Models e Policies
use App\Models\Gabinete;
use App\Models\Hospital;
use App\Models\Municipio;
use App\Models\Paciente;
use App\Models\Provincia;
use App\Models\Relatorio;
use App\Models\Usuario;
use App\Models\Viatura;

use App\Policies\ViaturaPolicy;
use App\Policies\GabinetePolicy;
use App\Policies\HospitalPolicy;
use App\Policies\MunicipioPolicy;
use App\Policies\PacientePolicy;
use App\Policies\ProvinciaPolicy;
use App\Policies\RelatorioPolicy;
use App\Policies\UsuarioPolicy;

class AuthServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Nenhum registro aqui para Policies no Laravel 12
    }

    public function boot(): void
    {
        // Mapeamento de Models para Policies
        Gate::policy(Viatura::class, ViaturaPolicy::class);
        Gate::policy(Gabinete::class, GabinetePolicy::class);
        Gate::policy(Hospital::class, HospitalPolicy::class);
        Gate::policy(Municipio::class, MunicipioPolicy::class);
        Gate::policy(Paciente::class, PacientePolicy::class);
        Gate::policy(Provincia::class, ProvinciaPolicy::class);
        Gate::policy(Relatorio::class, RelatorioPolicy::class);
        Gate::policy(Usuario::class, UsuarioPolicy::class);
    }
}
