<?php

namespace App\Http\Middleware;

use App\Services\VendraContextService;
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
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return [
            ...parent::share($request),

            'name' => config('app.name', 'Vendra'),

            'quote' => [
                'message' => trim($message),
                'author' => trim($author),
            ],

            /**
             * El contexto se calcula de forma diferida y queda memorizado dentro
             * de la solicitud por VendraContextService.
             */
            'auth' => fn (): array => app(VendraContextService::class)
                ->sharedAuth($request),

            'ziggy' => fn (): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],

            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
                'warning' => $request->session()->get('warning'),
                'info' => $request->session()->get('info'),
            ],
        ];
    }
}
