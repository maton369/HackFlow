<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProfileUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // 認証済みユーザーなら実行可能
    }

    public function rules(): array
    {
        return [
            'name' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255', 'unique:users,email,' . $this->user()->id], // 🔥 `required` を削除
            'password' => ['nullable', 'confirmed', 'min:8'],
            'bio' => ['nullable', 'string', 'max:500'],
            'tech_level' => ['nullable', 'in:beginner,intermediate,advanced'],
            'profile_image' => ['nullable', 'image', 'max:2048'],
            'tech_stacks' => ['nullable', 'array'],
            'tech_stacks.*' => ['string', 'max:255'],
            'urls' => ['nullable', 'array'],
            'urls.*.url' => ['nullable', 'url', 'max:255'],
            'urls.*.url_type' => ['nullable', 'string', 'max:255'],
        ];
    }
}
