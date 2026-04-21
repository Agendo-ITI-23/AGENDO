<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
        'user_id',
        'linked_user_id',
    ];

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }

    // El business_owner que administra este cliente
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // La cuenta de usuario del cliente (rol=customer) vinculada a este registro
    public function linkedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'linked_user_id');
    }

    // Alias para mantener compatibilidad con código existente
    public function user(): BelongsTo
    {
        return $this->owner();
    }
}
