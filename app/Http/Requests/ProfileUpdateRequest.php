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
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,' . $this->user()->id],
            'password' => ['nullable', 'confirmed', 'min:8'],
            'bio' => ['nullable', 'string', 'max:500'],
            'tech_level' => ['nullable', 'in:beginner,intermediate,advanced'],
            'profile_image_url' => ['nullable', 'url'],

            // 🔥 技術スタックを配列として許可
            'tech_stacks' => ['nullable', 'array'],
            'tech_stacks.*' => ['string', 'max:255'], // 各要素は文字列

            // 🔥 関連URLを配列として許可
            'urls' => ['nullable', 'array'],
            'urls.*.url' => ['nullable', 'url', 'max:255'], // URL形式
            'urls.*.url_type' => ['nullable', 'string', 'max:255'], // URLタイプ
        ];
    }
}
