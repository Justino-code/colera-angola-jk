<?php
namespace App\Http\Controllers\Auth;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;

class RegisterController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nome' => 'required',
            'email' => 'required|email|unique:usuario,email',
            'password' => 'required|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = Usuario::create([
            'nome' => $request->nome,
            'email' => $request->email,
            'password' => Hash::make($request->password),
                                'role' => 'tecnico',
                                'permissoes' => [],
                                'id_hospital' => 1, // ajuste conforme necessário
        ]);

        $user->sendEmailVerificationNotification();

        return response()->json(['message' => 'Verifique seu e-mail.'], 201);
    }
}
