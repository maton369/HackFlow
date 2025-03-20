import { useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';

export default function Edit({ auth, user }) {
    const { data, setData, patch, processing, errors, reset } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        bio: user.bio || '',
        tech_level: user.tech_level || '',
        profile_image: null,
        profile_image_url: user.profile_image_url || '', // 🔥 既存の画像URLを保持
        tech_stacks: user.tech_stacks.map(stack => stack.name) ?? [],
        urls: user.urls ?? [],
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    // 🔥 画像選択時の処理
    const handleFileChange = (e) => {
        setData('profile_image', e.target.files[0]);
    };

    const submit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        if (data.name !== user.name) {
            formData.append('name', data.name);
        }

        if (data.email !== user.email) {
            formData.append('email', data.email);
        }

        if (data.bio !== user.bio) {
            formData.append('bio', data.bio);
        }

        if (data.tech_level !== user.tech_level) {
            formData.append('tech_level', data.tech_level);
        }

        if (data.profile_image) {
            formData.append('profile_image', data.profile_image);
        }

        if (data.tech_stacks.length > 0) {
            data.tech_stacks.forEach(stack => formData.append('tech_stacks[]', stack));
        }

        // 🔥 デバッグ用ログ
        console.log("🚀 送信する FormData:");
        for (let [key, value] of formData.entries()) {
            console.log(`🔍 ${key}:`, value);
        }

        try {
            await axios.post(route('profile.update'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            alert('✅ プロフィールが更新されました！');
            window.location.href = route('mypage');
        } catch (error) {
            console.error("❌ 更新エラー:", error.response?.data || error.message);
        }
    };

    // ✅ 関連URLの追加・削除
    const addUrl = () => {
        setData('urls', [...data.urls, { id: null, url: '', url_type: '' }]);
    };

    const removeUrl = (index) => {
        setData('urls', data.urls.filter((_, i) => i !== index));
    };

    const updateUrl = (index, field, value) => {
        const newUrls = [...data.urls];
        newUrls[index][field] = value;
        setData('urls', newUrls);
    };

    // ✅ 技術スタックの追加・削除
    const addTechStack = () => {
        setData('tech_stacks', [...data.tech_stacks, '']);
    };

    const removeTechStack = (index) => {
        setData('tech_stacks', data.tech_stacks.filter((_, i) => i !== index));
    };

    const updateTechStack = (index, value) => {
        const newTechStacks = [...data.tech_stacks];
        newTechStacks[index] = value;
        setData('tech_stacks', newTechStacks);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">プロフィール編集</h2>}
        >
            <Head title="プロフィール編集" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={submit}>
                            {/* 🔥 基本情報 */}
                            <div>
                                <InputLabel htmlFor="name" value="名前" />
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full"
                                    autoComplete="name"
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="email" value="メールアドレス" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full"
                                    autoComplete="email"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            {/* 🔥 自己紹介 */}
                            <div className="mt-4">
                                <InputLabel htmlFor="bio" value="自己紹介" />
                                <TextInput
                                    id="bio"
                                    name="bio"
                                    value={data.bio}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('bio', e.target.value)}
                                />
                                <InputError message={errors.bio} className="mt-2" />
                            </div>

                            {/* 🔥 プロフィール画像アップロード */}
                            <div className="mt-4">
                                <InputLabel htmlFor="profile_image" value="プロフィール画像" />
                                <input
                                    id="profile_image"
                                    type="file"
                                    name="profile_image"
                                    accept="image/*"
                                    className="mt-1 block w-full"
                                    onChange={handleFileChange} // 🔥 画像を選択
                                />
                                <InputError message={errors.profile_image} className="mt-2" />
                            </div>

                            {/* 🔥 画像プレビュー */}
                            {data.profile_image_url && (
                                <div className="mt-4">
                                    <p>現在のプロフィール画像:</p>
                                    <img src={data.profile_image_url} alt="プロフィール画像" className="w-32 h-32 rounded-full" />
                                </div>
                            )}

                            {/* 🔥 技術レベル */}
                            <div className="mt-4">
                                <InputLabel htmlFor="tech_level" value="技術レベル" />
                                <select
                                    id="tech_level"
                                    name="tech_level"
                                    value={data.tech_level}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    onChange={(e) => setData('tech_level', e.target.value)}
                                >
                                    <option value="">選択してください</option>
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                                <InputError message={errors.tech_level} className="mt-2" />
                            </div>

                            {/* 🔥 技術スタック */}
                            <div className="mt-4">
                                <InputLabel value="技術スタック" />
                                {data.tech_stacks.map((stack, index) => (
                                    <div key={index} className="flex space-x-2 mt-2">
                                        <TextInput
                                            value={stack}
                                            className="w-full"
                                            onChange={(e) => updateTechStack(index, e.target.value)}
                                        />
                                        <button type="button" onClick={() => removeTechStack(index)} className="text-red-500">
                                            削除
                                        </button>
                                    </div>
                                ))}
                                <button type="button" onClick={addTechStack} className="mt-2 text-blue-500">
                                    + 技術を追加
                                </button>
                            </div>



                            {/* 🔥 関連URL */}
                            <div className="mt-4">
                                <InputLabel value="関連URL" />
                                {data.urls.map((url, index) => (
                                    <div key={index} className="flex space-x-2 mt-2">
                                        <select
                                            value={url.url_type}
                                            className="border-gray-300 rounded-md shadow-sm"
                                            onChange={(e) => updateUrl(index, 'url_type', e.target.value)}
                                        >
                                            <option value="">種類を選択</option>
                                            <option value="GitHub">GitHub</option>
                                            <option value="Portfolio">Portfolio</option>
                                            <option value="LinkedIn">LinkedIn</option>
                                            <option value="Twitter">Twitter</option>
                                            <option value="Other">その他</option>
                                        </select>
                                        <TextInput
                                            value={url.url}
                                            className="w-full"
                                            onChange={(e) => updateUrl(index, 'url', e.target.value)}
                                        />
                                        <button type="button" onClick={() => removeUrl(index)} className="text-red-500">
                                            削除
                                        </button>
                                    </div>
                                ))}
                                <button type="button" onClick={addUrl} className="mt-2 text-blue-500">
                                    + URLを追加
                                </button>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                                {/* 🔥 マイページに戻るボタン */}
                                <button
                                    type="button"
                                    onClick={() => window.location.href = route('mypage')}
                                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                >
                                    マイページに戻る
                                </button>

                                {/* 🔥 更新ボタン */}
                                <PrimaryButton className="ms-4" disabled={processing}>
                                    更新
                                </PrimaryButton>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
