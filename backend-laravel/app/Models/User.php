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

    
    public function surveys(): HasMany
    {
        return $this->hasMany(Survey::class);
    }

    
    public function votes(): HasMany
    {
        return $this->hasMany(Vote::class);
    }
}

