<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Vote extends Model
{
    protected $fillable = [
        'survey_id',
        'survey_option_id',
        'user_id',
    ];

    /**
     * Get the survey that owns this vote.
     */
    public function survey(): BelongsTo
    {
        return $this->belongsTo(Survey::class);
    }

    /**
     * Get the option that this vote is for.
     */
    public function option(): BelongsTo
    {
        return $this->belongsTo(SurveyOption::class, 'survey_option_id');
    }

    /**
     * Get the user that made this vote.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
