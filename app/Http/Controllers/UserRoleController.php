<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserRoleController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');

        $users = User::with('roles:id,name')
            ->buscar($search)
            ->orderBy('apellido')
            ->orderBy('nombre')
            ->paginate(10)
            ->withQueryString();

        $roles = Role::query()
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('User/Roles', [
            'users' => $users,
            'roles' => $roles,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'roles' => 'required|array',
            'roles.*' => 'required|string|exists:roles,name',
        ]);

        try {
            DB::transaction(function () use ($validated) {
                foreach ($validated['roles'] as $userId => $roleName) {
                    $user = User::find($userId);

                    if ($user) {
                        $user->syncRoles([$roleName]);
                    }
                }
            });

            return redirect()
                ->route('users.roles.index')
                ->with('success', 'Roles globales de usuarios actualizados correctamente.');
        } catch (\Throwable $e) {
            report($e);

            return redirect()
                ->back()
                ->with('error', 'No se pudieron actualizar los roles de usuarios.');
        }
    }
}
