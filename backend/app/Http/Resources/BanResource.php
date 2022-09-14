<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class BanResource extends JsonResource
{
    /**
     * The resource instance.
     *
     * @var \Cog\Laravel\Ban\Models\Ban
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
        $attrs = collect([]);

        $attrs->put('reason', $this->resource->comment);
        $attrs->put('created_at', $this->resource->created_at->toISOString(true));

        return $attrs;
    }
}
