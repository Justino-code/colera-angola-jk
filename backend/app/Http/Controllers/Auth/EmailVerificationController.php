<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\Verified;
use App\Models\Usuario;
use Illuminate\Support\Facades\Auth;

class EmailVerificationController extends Controller
{
    public function sendVerificationLink(Request $request)
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email já verificado.']);
        }

        $user->sendEmailVerificationNotification();

        return response()->json(['message' => 'Link de verificação enviado.']);
    }

    public function verify(Request $request, $id, $hash)
    {
        $user = Usuario::findOrFail($id);

        if (!hash_equals($hash, sha1($user->getEmailForVerification()))) {
            return response()->json(['message' => 'Link inválido.'], 400);
        }

        if (!$user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
            event(new Verified($user));
        }

        return response()->json(['message' => 'Email verificado.']);
    }
}
