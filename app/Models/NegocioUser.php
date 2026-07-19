<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NegocioUser extends Model
{
    use HasFactory;

    protected $table = 'negocio_user';

    protected $fillable = [
        'negocio_id',
        'user_id',
        'es_administrador',
        'activo',
    ];

    protected function casts(): array
    {
        return [
            'negocio_id' => 'integer',
            'user_id' => 'integer',
            'es_administrador' => 'boolean',
            'activo' => 'boolean',
        ];
    }

    public function negocio(): BelongsTo
    {
        return $this->belongsTo(Negocio::class, 'negocio_id');
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
