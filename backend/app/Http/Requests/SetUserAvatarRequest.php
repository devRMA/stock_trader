<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\File;

class SetUserAvatarRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'avatar' => [
                'nullable',
                File::image()
                    ->types(['jpg', 'png', 'jpeg'])
                    ->max(4 * 1024) // 4 Mb
                    ->dimensions(
                        Rule::dimensions()
                            ->minWidth(200)
                            ->maxWidth(600)
                            ->minHeight(200)
                            ->maxHeight(600)
                    ),
            ],
        ];
    }
}
