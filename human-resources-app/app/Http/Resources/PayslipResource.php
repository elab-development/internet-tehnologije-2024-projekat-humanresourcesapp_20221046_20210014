<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PayslipResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'issue_date' => $this->issue_date,
            'total_amount' => $this->total_amount,
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name
            ],
            'salary' => [
                'amount' => $this->salary->amount,
                'currency' => $this->salary->currency
            ],
            'bonus' => [
                'amount' => $this->bonus->amount,
                'reason' => $this->bonus->reason
            ]
        ];
    }
}
