<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * @property string $name
 * @property int $sell_amount
 * @property int $buy_amount
 * @property int $price
 * @property \Illuminate\Support\Carbon $last_price_update
 * @property int $max_actions
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 */
class Company extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'sell_amount',
        'buy_amount',
        'price',
        'last_price_update',
        'max_actions',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'sell_amount',
        'buy_amount',
        'last_price_update',
        'created_at',
        'updated_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'last_price_update' => 'datetime',
    ];

    /**
     * Relation N to N with User.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany<\App\Models\User>
     */
    public function investors(): BelongsToMany
    {
        return $this->belongsToMany(User::class)
            ->using(CompanyUser::class)
            ->withPivot('amount')
            ->withTimestamps();
    }
}
