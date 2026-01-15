<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserRoleController extends Controller
{

    public function index(Request $request)
    {
        $search = $request->query('search');

        $users = User::with('roles')
            ->buscar($search)
            ->orderBy('apellido')
            ->orderBy('nombre')
            ->paginate(10)
            ->withQueryString();

        $roles = Role::all();

        return Inertia::render('User/Roles', [
            'users' => $users,
            'roles' => $roles,
            'filters' => ['search' => $search],
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'roles'   => 'required|array',
            'roles.*' => 'string|exists:roles,name',
        ]);

        foreach ($validated['roles'] as $userId => $roleName) {
            $user = User::find($userId);
            if ($user) {
                $user->syncRoles([$roleName]);
            }
        }

        return redirect()
            ->route('users.roles.index')
            ->with('success', 'Roles de usuarios actualizados correctamente.');
    }
}
