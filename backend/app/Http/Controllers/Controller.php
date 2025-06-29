<?php

namespace App\Http\Controllers;

use FontLib\Table\Type\name;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests; // <-- importante
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use OpenApi\Attributes as OA;

#[
    OA\Info(
        title: "API Angola Viva",
        version: "1.0.0",
        description: "Documentação da API do sistema Angola Viva"
    ),
    OA\Server(
        url: "http://localhost:8000/api/v1",
        description: "Servidor de desenvolvimento"
    ),
    OA\SecurityScheme(
        securityScheme:"bearerAuth", type:"http", scheme:"bearer", bearerFormat:"JWT", name:"Authorization", in:"header",
        description:"Utilize o token JWT no formato Bearer para autenticação."
        ),
]
class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests; // <-- precisa do AuthorizesRequests aqui
}
