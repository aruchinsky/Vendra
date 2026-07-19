<?php

namespace App\Http\Controllers;

use App\Models\NegocioUser;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');

        $users = User::with([
            'roles:id,name',
            'negocios.plan:id,nombre,slug',
        ])
            ->buscar($search)
            ->orderBy('apellido')
            ->orderBy('nombre')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Users/Index', [
            'users' => $users,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create(): Response
    {
        $roles = Role::query()
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Users/Create', [
            'roles' => $roles,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            // Datos personales.
            'nombre' => 'required|string|max:100',
            'apellido' => 'required|string|max:100',
            'dni' => 'nullable|string|max:20|unique:users,dni',
            'telefono' => 'nullable|string|max:50',
            'domicilio' => 'nullable|string|max:255',

            // Acceso.
            'username' => 'required|string|max:100|unique:users,username',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',

            // Estado y rol global.
            'estado' => 'nullable|in:activo,inactivo,suspendido',
            'rol' => 'nullable|string|exists:roles,name',
            'role' => 'nullable|string|exists:roles,name',
        ]);

        try {
            DB::transaction(function () use ($validated) {
                $rol = $validated['rol'] ?? $validated['role'] ?? 'usuario';

                $user = User::create([
                    'nombre' => $validated['nombre'],
                    'apellido' => $validated['apellido'],
                    'dni' => $validated['dni'] ?? null,
                    'telefono' => $validated['telefono'] ?? null,
                    'domicilio' => $validated['domicilio'] ?? null,
                    'username' => $validated['username'],
                    'email' => $validated['email'],
                    'password' => Hash::make($validated['password']),
                    'estado' => $validated['estado'] ?? 'activo',
                ]);

                $user->syncRoles([$rol]);
            });

            return redirect()
                ->route('users.index')
                ->with('success', 'Usuario creado correctamente.');
        } catch (\Throwable $e) {
            report($e);

            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'No se pudo crear el usuario.');
        }
    }

    public function edit(User $user): Response
    {
        $roles = Role::query()
            ->orderBy('name')
            ->get(['id', 'name']);

        $user->append('nombre_completo');

        return Inertia::render('Users/Edit', [
            'user' => $user->load([
                'roles:id,name',
                'negocios.plan:id,nombre,slug',
            ]),
            'roles' => $roles,
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            // Datos personales.
            'nombre' => 'required|string|max:100',
            'apellido' => 'required|string|max:100',
            'dni' => 'nullable|string|max:20|unique:users,dni,' . $user->id,
            'telefono' => 'nullable|string|max:50',
            'domicilio' => 'nullable|string|max:255',

            // Acceso.
            'username' => 'required|string|max:100|unique:users,username,' . $user->id,
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8|confirmed',

            // Estado y rol global.
            'estado' => 'nullable|in:activo,inactivo,suspendido',
            'rol' => 'nullable|string|exists:roles,name',
            'role' => 'nullable|string|exists:roles,name',
        ]);

        try {
            DB::transaction(function () use ($validated, $user) {
                $payload = [
                    'nombre' => $validated['nombre'],
                    'apellido' => $validated['apellido'],
                    'dni' => $validated['dni'] ?? null,
                    'telefono' => $validated['telefono'] ?? null,
                    'domicilio' => $validated['domicilio'] ?? null,
                    'username' => $validated['username'],
                    'email' => $validated['email'],
                    'estado' => $validated['estado'] ?? $user->estado,
                ];

                if (! empty($validated['password'])) {
                    $payload['password'] = Hash::make($validated['password']);
                }

                $user->update($payload);

                $rol = $validated['rol'] ?? $validated['role'] ?? null;

                if ($rol) {
                    $user->syncRoles([$rol]);
                }

                if ($user->estado !== 'activo') {
                    NegocioUser::query()
                        ->where('user_id', $user->id)
                        ->update(['activo' => false]);
                }
            });

            return redirect()
                ->route('users.index')
                ->with('success', 'Usuario actualizado correctamente.');
        } catch (\Throwable $e) {
            report($e);

            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'No se pudo actualizar el usuario.');
        }
    }

    public function destroy(User $user): RedirectResponse
    {
        if (auth()->id() === $user->id) {
            return redirect()
                ->back()
                ->with('error', 'No podés desactivar tu propia cuenta desde esta pantalla.');
        }

        foreach ($user->negociosAdministrados()->get() as $negocio) {
            $tieneOtroAdministrador = $negocio->administradores()
                ->where('users.id', '!=', $user->id)
                ->exists();

            if (! $tieneOtroAdministrador) {
                return redirect()
                    ->back()
                    ->with('error', "El usuario es el único administrador activo de {$negocio->nombre_comercial}.");
            }
        }

        try {
            DB::transaction(function () use ($user) {
                $user->update(['estado' => 'inactivo']);

                NegocioUser::query()
                    ->where('user_id', $user->id)
                    ->update(['activo' => false]);
            });

            return redirect()
                ->route('users.index')
                ->with('success', 'Usuario desactivado correctamente.');
        } catch (\Throwable $e) {
            report($e);

            return redirect()
                ->back()
                ->with('error', 'No se pudo desactivar el usuario.');
        }
    }
}
