<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Mostrar la pantalla pública de registro.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Registrar una nueva cuenta de usuario en Vendra.
     *
     * El usuario se crea sin negocio ni plan directo. Luego podrá crear su
     * primer negocio, que recibirá el plan Free desde NegocioController.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nombre' => ['required', 'string', 'max:100'],
            'apellido' => ['required', 'string', 'max:100'],
            'username' => ['required', 'string', 'max:100', 'regex:/^[A-Za-z0-9._-]+$/', 'unique:users,username'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = DB::transaction(function () use ($validated): User {
            $user = User::create([
                'nombre' => $validated['nombre'],
                'apellido' => $validated['apellido'],
                'username' => $validated['username'],
                'email' => $validated['email'],
                'password' => $validated['password'],
                'estado' => 'activo',
            ]);

            // Free/Premium ya no son roles. Todo usuario público recibe
            // únicamente el rol global base de Vendra.
            $user->assignRole('usuario');

            return $user;
        });

        event(new Registered($user));
        Auth::login($user);

        return redirect()->route('dashboard');
    }
}
