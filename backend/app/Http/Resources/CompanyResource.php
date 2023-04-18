<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CompanyResource extends JsonResource
{
    /**
     * The resource instance.
     *
     * @var \App\Models\Company
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
            'money_invested' => $this->resource->money_invested,
            'balance' => $this->resource->balance,
            'ipo' => $this->resource->ipo,
            'selling_percentage' => $this->resource->selling_percentage,
            'share_price' => $this->resource->share_price,
        ];
    }
}
