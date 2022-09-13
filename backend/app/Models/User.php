<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Http\UploadedFile;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media as SpatieMedia;

/**
 * @property string $name
 * @property string $email
 * @property string $password
 * @property string|null $remember_token
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property string|null $two_factor_confirmed_at
 * @property \App\Models\CompanyUser $pivot
 * @property \Illuminate\Database\Eloquent\Collection<int, \App\Models\Company> $actions
 * @property string $money
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 */
class User extends Authenticatable implements HasMedia
{
    use HasApiTokens, HasFactory, TwoFactorAuthenticatable;

    // @see https://spatie.be/docs/laravel-medialibrary/v10/basic-usage/preparing-your-model
    use InteractsWithMedia;

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
        'money' => 'integer',
        'email_verified_at' => 'datetime',
    ];

    protected $showPrivatesAttribute = false;

    /**
     * Relation N to N with Company.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany<\App\Models\Company>
     */
    public function actions(): BelongsToMany
    {
        return $this->belongsToMany(Company::class)
            ->using(CompanyUser::class)
            ->withPivot('amount')
            ->withTimestamps();
    }

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

    public function setMoney(int | float $money): self
    {
        if ($money <= 0) {
            $money = 0;
        }

        return $this->setAttribute('money', (string) $money);
    }

    public function getAvatar(): ?SpatieMedia
    {
        return $this->getFirstMedia('avatar');
    }

    public function getAvatarUrl(): ?string
    {
        $avatarUrl = $this->getFirstMediaUrl('avatar');
        $avatarUrl = $avatarUrl === '' ? null : $avatarUrl;

        return $avatarUrl;
    }

    public function setAvatar(?UploadedFile $avatar): self
    {
        $this->clearMediaCollection('avatar');
        if ($avatar !== null) {
            $this
                ->addMedia($avatar)
                ->usingFileName('avatar.'.$avatar->clientExtension())
                ->toMediaCollection('avatar');
        }

        return $this;
    }
}
