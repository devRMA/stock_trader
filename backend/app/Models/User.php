<?php

namespace App\Models;

use Cog\Contracts\Ban\Bannable as BannableContract;
use Cog\Laravel\Ban\Traits\Bannable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
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
 * @property bool $admin
 * @property string $name
 * @property string $email
 * @property string $password
 * @property string|null $remember_token
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property string|null $two_factor_confirmed_at
 * @property \App\Models\CompanyUser $pivot
 * @property \Illuminate\Database\Eloquent\Collection<int, \App\Models\Company> $actions
 * @property \Illuminate\Database\Eloquent\Collection<int, \Cog\Laravel\Ban\Models\Ban> $bans
 * @property string $money
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 */
class User extends Authenticatable implements HasMedia, BannableContract
{
    use HasApiTokens, HasFactory, HasUuids, TwoFactorAuthenticatable;

    // @see https://spatie.be/docs/laravel-medialibrary/v10/basic-usage/preparing-your-model
    use InteractsWithMedia;

    // @see https://github.com/cybercog/laravel-ban
    use Bannable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'email',
        'money',
        'name',
        'password',
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'admin',
        'email_verified_at',
        'password',
        'remember_token',
        'two_factor_confirmed_at',
        'two_factor_recovery_codes',
        'two_factor_secret',
        'updated_at',
        'banned_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'money' => 'integer',
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

    public function setAvatarFromUrl(?string $url): self
    {
        $this->clearMediaCollection('avatar');
        if ($url !== null && $url !== '') {
            $this
                ->addMediaFromUrl($url)
                ->toMediaCollection('avatar');
        }

        return $this;
    }
}
