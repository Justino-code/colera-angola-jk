<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Carbon;
use Illuminate\Http\Request;
use App\Models\Usuario;

class LoginAction
{
    public function handle(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = Usuario::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Credenciais inválidas.'
            ], 401);
        }

        if (!$user->hasVerifiedEmail()) {
            return response()->json([
                'success' => false,
                'message' => 'Email não verificado.'
            ], 403);
        }

        // Cria o token
        $tokenResult = $user->createToken('auth-token');

        // Define a expiração (ex: 60 minutos a partir de agora)
        $token = $tokenResult->accessToken;
        $token->expires_at = Carbon::now()->addMinutes(60);
        //$token->expires_at = Carbon::now()->addSeconds(60);
        $token->save();

        return response()->json([
            'success' => true,
            'message' => 'Login realizado com sucesso.',
            'data' => [
                'token' => $tokenResult->plainTextToken,
                'usuario' => $user
            ]
        ], 200);
    }
}
