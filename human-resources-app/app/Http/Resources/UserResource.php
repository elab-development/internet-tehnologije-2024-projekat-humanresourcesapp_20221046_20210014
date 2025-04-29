<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->isHr ? 'HR Worker' : 'Worker',
            'gender' => $this->gender,
            'date_of_birth' => $this->date_of_birth,
            'contract_start_date' => $this->contract_start_date,
            'position' => $this->position,
        ];
    }
}
