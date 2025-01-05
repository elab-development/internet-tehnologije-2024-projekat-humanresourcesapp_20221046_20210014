<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BonusResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'amount' => $this->amount,
            'reason' => $this->reason,
            'date_awarded' => $this->date_awarded,
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name
            ],
        ];
    }
}
