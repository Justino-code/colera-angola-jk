<?php
namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;

class LogoutAction
{
    public function handle(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout efetuado com sucesso.',
        ]);
    }
}
