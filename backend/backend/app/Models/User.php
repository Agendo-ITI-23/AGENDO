<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'business_name',
        'business_description',
        'phone',
        'address',
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

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isBusinessOwner(): bool
    {
        return $this->role === 'business_owner';
    }

    public function isCustomer(): bool
    {
        return $this->role === 'customer';
    }

    public function services(): HasMany
    {
        return $this->hasMany(Service::class);
    }

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }

    // Registros de clientes que este business_owner administra
    public function customers(): HasMany
    {
        return $this->hasMany(Customer::class);
    }

    // Registro de cliente vinculado a esta cuenta (rol=customer)
    public function linkedCustomerProfiles(): HasMany
    {
        return $this->hasMany(Customer::class, 'linked_user_id');
    }
}
