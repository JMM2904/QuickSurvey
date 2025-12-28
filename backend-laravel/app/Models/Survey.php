<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Survey extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get the user that owns the survey.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the options for the survey.
     */
    public function options(): HasMany
    {
        return $this->hasMany(SurveyOption::class);
    }

    /**
     * Get the votes for the survey.
     */
    public function votes(): HasMany
    {
        return $this->hasMany(Vote::class);
    }
}
