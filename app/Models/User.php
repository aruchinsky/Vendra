<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasRoles;

    protected $fillable = [
        // Datos personales.
        'nombre',
        'apellido',
        'dni',
        'telefono',
        'domicilio',

        // Acceso y cuenta.
        'username',
        'email',
        'password',
        'estado',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /* =========================================================
       Relaciones
    ========================================================= */

    public function negocios(): BelongsToMany
    {
        return $this->belongsToMany(Negocio::class, 'negocio_user')
            ->withPivot([
                'id',
                'es_administrador',
                'activo',
            ])
            ->withTimestamps();
    }

    public function negociosActivos(): BelongsToMany
    {
        return $this->negocios()
            ->where('negocios.activo', true)
            ->wherePivot('activo', true);
    }

    public function negociosAdministrados(): BelongsToMany
    {
        return $this->negociosActivos()
            ->wherePivot('es_administrador', true);
    }

    public function pagosSuscripciones(): HasMany
    {
        return $this->hasMany(PagoSuscripcion::class, 'user_id');
    }

    /* =========================================================
       Accesores
    ========================================================= */

    public function getNombreCompletoAttribute(): string
    {
        return trim(($this->nombre ?? '') . ' ' . ($this->apellido ?? ''));
    }

    /* =========================================================
       Scopes
    ========================================================= */

    public function scopeBuscar(Builder $query, ?string $search): Builder
    {
        if (! $search) {
            return $query;
        }

        return $query->where(function (Builder $q) use ($search) {
            $q->where('nombre', 'like', "%{$search}%")
                ->orWhere('apellido', 'like', "%{$search}%")
                ->orWhere('username', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('dni', 'like', "%{$search}%");
        });
    }
}
