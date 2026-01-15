<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{

    public function index(Request $request)
    {
        $search = $request->query('search');

        $users = User::with(['roles', 'plan:id,nombre', 'negocio:id,nombre_comercial'])
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

    public function create()
    {
        $roles = Role::all(['id','name']);
        return Inertia::render('Users/Create', [
            'roles' => $roles,
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                // Datos personales
                'nombre'   => 'required|string|max:100',
                'apellido' => 'required|string|max:100',
                'dni'      => 'nullable|string|max:20|unique:users,dni',
                'telefono' => 'nullable|string|max:50',
                'domicilio'=> 'nullable|string|max:255',

                // Acceso
                'username' => 'required|string|max:100|unique:users,username',
                'email'    => 'required|email|unique:users,email',
                'password' => 'required|min:6|confirmed',

                // Estado / relaciones
                'estado'     => 'nullable|in:activo,inactivo,suspendido',
                'plan_id'    => 'nullable|exists:planes,id',
                'negocio_id' => 'nullable|exists:negocios,id',

                // Rol (acepto rol o role)
                'rol'   => 'nullable|exists:roles,name',
                'role'  => 'nullable|exists:roles,name',
            ]);

            $rol = $validated['rol'] ?? $validated['role'] ?? null;

            $user = User::create([
                'nombre'     => $validated['nombre'],
                'apellido'   => $validated['apellido'],
                'dni'        => $validated['dni'] ?? null,
                'telefono'   => $validated['telefono'] ?? null,
                'domicilio'  => $validated['domicilio'] ?? null,
                'username'   => $validated['username'],
                'email'      => $validated['email'],
                'password'   => Hash::make($validated['password']),
                'estado'     => $validated['estado'] ?? 'activo',
                'plan_id'    => $validated['plan_id'] ?? null,
                'negocio_id' => $validated['negocio_id'] ?? null,
            ]);

            if ($rol) {
                $user->assignRole($rol);
            }

            return redirect()
                ->route('users.index')
                ->with('success', 'Usuario creado correctamente.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', 'No se pudo crear el usuario: ' . $e->getMessage());
        }
    }

    public function edit(User $user)
    {
        $roles = Role::all(['id','name']);

        // Si necesitás el accessor en front:
        $user->append('nombre_completo');

        return Inertia::render('Users/Edit', [
            'user'  => $user->load('roles:id,name'),
            'roles' => $roles,
        ]);
    }

    public function update(Request $request, User $user)
    {
        try {
            $validated = $request->validate([
                // Datos personales
                'nombre'   => 'required|string|max:100',
                'apellido' => 'required|string|max:100',
                'dni'      => 'nullable|string|max:20|unique:users,dni,' . $user->id,
                'telefono' => 'nullable|string|max:50',
                'domicilio'=> 'nullable|string|max:255',

                // Acceso
                'username' => 'required|string|max:100|unique:users,username,' . $user->id,
                'email'    => 'required|email|unique:users,email,' . $user->id,
                'password' => 'nullable|min:6|confirmed',

                // Estado / relaciones
                'estado'     => 'nullable|in:activo,inactivo,suspendido',
                'plan_id'    => 'nullable|exists:planes,id',
                'negocio_id' => 'nullable|exists:negocios,id',

                // Rol (acepto rol o role)
                'rol'   => 'nullable|exists:roles,name',
                'role'  => 'nullable|exists:roles,name',
            ]);

            $payload = [
                'nombre'     => $validated['nombre'],
                'apellido'   => $validated['apellido'],
                'dni'        => $validated['dni'] ?? $user->dni,
                'telefono'   => $validated['telefono'] ?? null,
                'domicilio'  => $validated['domicilio'] ?? null,
                'username'   => $validated['username'],
                'email'      => $validated['email'],
                'estado'     => $validated['estado'] ?? $user->estado,
                'plan_id'    => $validated['plan_id'] ?? null,
                'negocio_id' => $validated['negocio_id'] ?? null,
            ];

            if (!empty($validated['password'])) {
                $payload['password'] = Hash::make($validated['password']);
            }

            $user->update($payload);

            $rol = $validated['rol'] ?? $validated['role'] ?? null;
            if ($rol) {
                $user->syncRoles([$rol]);
            }

            return redirect()
                ->route('users.index')
                ->with('success', 'Usuario actualizado correctamente.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', 'No se pudo actualizar el usuario: ' . $e->getMessage());
        }
    }

    public function destroy(User $user)
    {
        try {
            $user->delete();

            return redirect()
                ->route('users.index')
                ->with('success', 'Usuario eliminado correctamente.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', 'No se pudo eliminar el usuario: ' . $e->getMessage());
        }
    }
}
