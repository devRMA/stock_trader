<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PrivateUserResource extends JsonResource
{
    /**
     * The resource instance.
     *
     * @var \App\Models\User
     */
    public $resource;

    /**
     * Transform the resource into an array.
     *
     * @return array<string,mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource->id,
            'name' => $this->resource->name,
            'email' => $this->resource->email,
            'money' => $this->resource->money,
            'two_factor' => $this->resource->hasEnabledTwoFactorAuthentication(),
        ];
    }
}
