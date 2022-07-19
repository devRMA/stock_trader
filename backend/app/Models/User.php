<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Sanctum\HasApiTokens;

/**
 * @property string $name
 * @property string $email
 * @property string $password
 * @property string|null $remember_token
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property string|null $two_factor_confirmed_at
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 */
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'money',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'email_verified_at',
        'updated_at',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'two_factor_confirmed_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    protected $showPrivatesAttribute = false;

    // * GETTERS & SETTERS

    public function showPrivatesAttributes(): self
    {
        $this->showPrivatesAttribute = true;

        return $this;
    }

    public function hiddenPrivatesAttributes(): self
    {
        $this->showPrivatesAttribute = false;

        return $this;
    }

    public function getShowPrivatesAttribute(): bool
    {
        return $this->showPrivatesAttribute;
    }

    public function getMoney(): int
    {
        return (int) $this->money;
    }

    public function setMoney(int|float $money): self
    {
        if ($money <= 0) {
            $money = 0;
        }

        return $this->setAttribute('money', (string) $money);
    }
}
