<?php

namespace App\Http\Controllers\Auth;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;

class RegisterAction
{
    public function handle(Request $request)
    {
        // Validação dos dados de entrada
        $validator = Validator::make($request->all(), [
            'nome' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:usuario,email',
            'password' => 'required|string|min:8|confirmed', // Confirm password
            'role' => 'required|in:gestor,medico,tecnico,enfermeiro,epidemiologista,administrativo,agente_sanitario,farmaceutico,analista_dados,coordenador_regional', // Validar role
            'id_hospital' => 'samestimes|exists:hospital,id_hospital',
            'permissoes' => 'required|array', // Validar que 'permissoes' seja um array
            'permissoes.*' => 'string', // Validar que cada permissão dentro do array seja uma string.
        ]);

        // Verifica se a validação falhou
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erro de validação.',
                'errors' => $validator->errors()
            ], 422);
        }

        // Criação do usuário
        $user = Usuario::create([
            'nome' => $request->nome,
            'email' => $request->email,
            'password' => Hash::make($request->password), // Hash da senha
            'role' => $request->role,
            'permissoes' => json_encode($request->permissoes), // Armazenando permissões como JSON
            'id_hospital' => $request->id_hospital,
        ]);

        // Envio de notificação de verificação de e-mail
        //$user->sendEmailVerificationNotification();

        // Resposta com sucesso
        return response()->json([
            'message' => 'Usuário registrado com sucesso! Verifique seu e-mail para a verificação.',
            'user' => $user // Retorna o usuário criado (opcional, mas útil)
        ], 201);
    }
}
