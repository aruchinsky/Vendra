<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * La vista raíz cargada en la primera visita.
     */
    protected $rootView = 'app';

    /**
     * Determina la versión de los assets.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define los datos compartidos por defecto con Inertia.
     */
    public function share(Request $request): array
    {
        // Frase aleatoria para propósitos visuales (puedes quitarla si no la usás)
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return [
            ...parent::share($request),

            // Nombre de la aplicación
            'name' => config('app.name', 'Vendra'),

            // Frase inspiradora opcional
            'quote' => [
                'message' => trim($message),
                'author' => trim($author),
            ],

            // Información del usuario autenticado
            'auth' => [
                'user' => $request->user(),
                'roles' => $request->user()?->getRoleNames() ?? [],
                'permissions' => $request->user()?->getAllPermissions()->pluck('name') ?? [],
            ],

            // Configuración de rutas de Ziggy
            'ziggy' => fn (): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],

            // Mensajes flash
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
                'warning' => $request->session()->get('warning'),
                'info' => $request->session()->get('info'),
            ],
        ];
    }
}
