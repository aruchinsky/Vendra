<?php

namespace App\Http\Middleware;

use App\Services\VendraContextService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Exige un negocio activo y autorizado antes de acceder a módulos operativos.
 */
class EnsureActiveBusiness
{
    public function __construct(
        private readonly VendraContextService $contextService,
    ) {
    }

    public function handle(Request $request, Closure $next): Response
    {
        $context = $this->contextService->resolve($request);
        $negocio = $context['negocio_activo'];

        if (! $negocio) {
            return redirect()
                ->route('dashboard')
                ->with('warning', 'Seleccioná un negocio antes de ingresar a este módulo.');
        }

        $request->attributes->set('negocio_activo', $negocio);

        return $next($request);
    }
}
