import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        bio: '',
        tech_level: '',
        profile_image_url: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onSuccess: () => {
                window.location.href = route('mypage'); // 🔥 成功時にマイページへリダイレクト
            },
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="name" value="Name" />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                {/* 🔥 bioフィールド追加 */}
                <div className="mt-4">
                    <InputLabel htmlFor="bio" value="自己紹介 (任意)" />
                    <TextInput
                        id="bio"
                        name="bio"
                        value={data.bio}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('bio', e.target.value)}
                    />
                    <InputError message={errors.bio} className="mt-2" />
                </div>

                {/* 🔥 tech_levelフィールド追加 */}
                <div className="mt-4">
                    <InputLabel htmlFor="tech_level" value="技術レベル (必須)" />
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

                {/* 🔥 profile_image_urlフィールド追加 */}
                <div className="mt-4">
                    <InputLabel htmlFor="profile_image_url" value="プロフィール画像URL (任意)" />
                    <TextInput
                        id="profile_image_url"
                        name="profile_image_url"
                        value={data.profile_image_url}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('profile_image_url', e.target.value)}
                    />
                    <InputError message={errors.profile_image_url} className="mt-2" />
                </div>

                <div className="flex items-center justify-end mt-4">
                    <Link href={route('login')} className="underline text-sm text-gray-600 hover:text-gray-900">
                        Already registered?
                    </Link>
                    <PrimaryButton className="ms-4" disabled={processing}>
                        Register
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
