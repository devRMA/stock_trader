<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $attrs = collect((array) parent::toArray($request));
        $attrs->put('created_at', $this->resource->created_at->toDateString());
        $attrs->put(
            'avatar',
            $this->resource->getAvatarUrl()
        );

        if ($this->resource->getShowPrivatesAttribute()) {
            $attrs->put('two_factor', $this->resource->hasEnabledTwoFactorAuthentication());
        } else {
            $attrs->forget([
                'email',
            ]);
        }

        return $attrs;
    }
}
