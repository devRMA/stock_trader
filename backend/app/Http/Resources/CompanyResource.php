<?php

namespace App\Http\Resources;

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
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $attrs = collect((array) parent::toArray($request));

        $attrs->put(
            'actions_available',
            $this->resource->max_actions - $this->resource->investors->sum('pivot.amount')
        );
        if ($attrs->has('pivot')) {
            $attrs->put('amount', $this->resource->pivot->amount);
            $attrs->forget('pivot');
        }

        return $attrs;
    }
}
