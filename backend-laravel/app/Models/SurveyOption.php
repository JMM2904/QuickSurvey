<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SurveyOption extends Model
{
    protected $fillable = [
        'survey_id',
        'text',
        'color',
    ];

    /**
     * Get the survey that owns this option.
     */
    public function survey(): BelongsTo
    {
        return $this->belongsTo(Survey::class);
    }

    /**
     * Get the votes for this option.
     */
    public function votes(): HasMany
    {
        return $this->hasMany(Vote::class, 'survey_option_id');
    }
}
