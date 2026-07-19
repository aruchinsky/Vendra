<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Negocio extends Model
{
    use HasFactory;

    protected $table = 'negocios';

    protected $fillable = [
        'plan_id',
        'nombre_comercial',
        'cuit_cuil',
        'telefono',
        'direccion',
        'rubro',
        'logo_path',
        'activo',
    ];

    protected function casts(): array
    {
        return [
            'plan_id' => 'integer',
            'activo' => 'boolean',
        ];
    }

    /* =========================================================
       Relaciones principales
    ========================================================= */

    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class, 'plan_id');
    }

    public function usuarios(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'negocio_user')
            ->withPivot([
                'id',
                'es_administrador',
                'activo',
            ])
            ->withTimestamps();
    }

    public function usuariosActivos(): BelongsToMany
    {
        return $this->usuarios()
            ->where('users.estado', 'activo')
            ->wherePivot('activo', true);
    }

    public function administradores(): BelongsToMany
    {
        return $this->usuariosActivos()
            ->wherePivot('es_administrador', true);
    }

    public function membresias(): HasMany
    {
        return $this->hasMany(NegocioUser::class, 'negocio_id');
    }

    public function pagosSuscripciones(): HasMany
    {
        return $this->hasMany(PagoSuscripcion::class, 'negocio_id');
    }

    /* =========================================================
       Relaciones operativas existentes en Vendra
    ========================================================= */

    public function categorias(): HasMany
    {
        return $this->hasMany(Categoria::class, 'negocio_id');
    }

    public function productos(): HasMany
    {
        return $this->hasMany(Producto::class, 'negocio_id');
    }

    public function clientes(): HasMany
    {
        return $this->hasMany(Cliente::class, 'negocio_id');
    }

    public function ventas(): HasMany
    {
        return $this->hasMany(Venta::class, 'negocio_id');
    }

    /* =========================================================
       Consultas de membresía
    ========================================================= */

    public function tieneUsuarioActivo(int $userId): bool
    {
        return $this->usuariosActivos()
            ->where('users.id', $userId)
            ->exists();
    }

    public function esAdministrador(int $userId): bool
    {
        return $this->administradores()
            ->where('users.id', $userId)
            ->exists();
    }

    /* =========================================================
       Scopes
    ========================================================= */

    public function scopeActivos(Builder $query): Builder
    {
        return $query->where('activo', true);
    }

    public function scopeBuscar(Builder $query, ?string $search): Builder
    {
        if (! $search) {
            return $query;
        }

        return $query->where(function (Builder $q) use ($search) {
            $q->where('nombre_comercial', 'like', "%{$search}%")
                ->orWhere('cuit_cuil', 'like', "%{$search}%")
                ->orWhere('rubro', 'like', "%{$search}%");
        });
    }
}
