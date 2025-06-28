<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login(Request $request, LoginAction $login)
    {
        return $login->handle($request);
        //return response()->json($data);
    }

    public function register(Request $request, RegisterAction $register)
    {
        $data = $register->handle($request);
        return response()->json($data, 201);
    }

    public function logout(Request $request, LogoutAction $logout)
    {
        return $logout->handle($request);
    }
}
