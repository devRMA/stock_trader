<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

/**
 * @property int $company_id
 * @property int $user_id
 * @property int $amount
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 */
class CompanyUser extends Pivot
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'company_id',
        'user_id',
        'amount',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'company_id',
        'user_id',
        'created_at',
        'updated_at',
    ];

    /**
     * Relation 1 to N with Company.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<\App\Models\Company, \App\Models\CompanyUser>
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Relation 1 to N with User.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<\App\Models\User, \App\Models\CompanyUser>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The amount of actions the user purchased.
     *
     * @return int
     */
    public function getAmount(): int
    {
        return (int) $this->amount;
    }
}
