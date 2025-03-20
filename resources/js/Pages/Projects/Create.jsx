import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link } from '@inertiajs/react';

export default function Create({ auth, teams }) {
    const { data, setData, post, processing, errors } = useForm({
        project_name: '',
        app_name: '',
        project_image: null,
        github_url: '',
        live_url: '',
        team_id: '',
        tech_stacks: [], // 🔥 追加・削除可能な配列
        tags: [], // 🔥 追加・削除可能な配列
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e) => {
        setData('project_image', e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // ✅ ローディング開始

        const formData = new FormData();
        formData.append('project_name', data.project_name);
        formData.append('app_name', data.app_name);
        if (data.project_image) {
            formData.append('project_image', data.project_image); // ✅ 画像を追加
        }
        formData.append('github_url', data.github_url);
        formData.append('live_url', data.live_url);
        formData.append('team_id', data.team_id);

        data.tech_stacks.forEach(stack => formData.append('tech_stacks[]', stack));
        data.tags.forEach(tag => formData.append('tags[]', tag));

        try {
            await axios.post(route('projects.store'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            alert('✅ プロジェクトが作成されました！');
            window.location.href = route('mypage');
        } catch (error) {
            console.error("❌ 作成エラー:", error.response?.data || error.message);
        } finally {
            setIsLoading(false); // ✅ ローディング終了
        }
    };

    // ✅ 使用技術の追加・削除
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

    // ✅ タグの追加・削除
    const addTag = () => {
        setData('tags', [...data.tags, '']);
    };

    const removeTag = (index) => {
        setData('tags', data.tags.filter((_, i) => i !== index));
    };

    const updateTag = (index, value) => {
        const newTags = [...data.tags];
        newTags[index] = value;
        setData('tags', newTags);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">プロジェクト作成</h2>}
        >
            <Head title="プロジェクト作成" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg p-6">

                        {isLoading && (
                            <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-80">
                                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-600"></div>
                            </div>
                        )}

                        {!isLoading && (
                            <form onSubmit={handleSubmit}>
                                {/* ✅ プロジェクト名 */}
                                <div>
                                    <InputLabel htmlFor="project_name" value="プロジェクト名" />
                                    <TextInput
                                        id="project_name"
                                        value={data.project_name}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('project_name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.project_name} className="mt-2" />
                                </div>

                                {/* ✅ アプリ名 */}
                                <div className="mt-4">
                                    <InputLabel htmlFor="app_name" value="アプリ名" />
                                    <TextInput
                                        id="app_name"
                                        value={data.app_name}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('app_name', e.target.value)}
                                    />
                                    <InputError message={errors.app_name} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="project_image" value="プロジェクト画像" />
                                    <input
                                        id="project_image"
                                        type="file"
                                        name="project_image"
                                        accept="image/*"
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('project_image', e.target.files[0])}
                                    />
                                    <InputError message={errors.project_image} className="mt-2" />
                                </div>

                                {data.project_image_url && (
                                    <div className="mt-4">
                                        <p>現在のプロジェクト画像:</p>
                                        <img src={data.project_image_url} alt="プロジェクト画像" className="w-32 h-32 rounded-full" />
                                    </div>
                                )}

                                {/* ✅ GitHub URL */}
                                <div className="mt-4">
                                    <InputLabel htmlFor="github_url" value="GitHub リポジトリ (任意)" />
                                    <TextInput
                                        id="github_url"
                                        value={data.github_url}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('github_url', e.target.value)}
                                    />
                                    <InputError message={errors.github_url} className="mt-2" />
                                </div>

                                {/* ✅ Live URL */}
                                <div className="mt-4">
                                    <InputLabel htmlFor="live_url" value="公開URL (任意)" />
                                    <TextInput
                                        id="live_url"
                                        value={data.live_url}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('live_url', e.target.value)}
                                    />
                                    <InputError message={errors.live_url} className="mt-2" />
                                </div>

                                {/* ✅ チーム選択 */}
                                <div className="mt-4">
                                    <InputLabel htmlFor="team_id" value="チームを選択" />
                                    <select
                                        id="team_id"
                                        value={data.team_id}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        onChange={(e) => setData('team_id', e.target.value)}
                                        required
                                    >
                                        <option value="">チームを選択</option>
                                        {teams.map((team) => (
                                            <option key={team.id} value={team.id}>
                                                {team.team_name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.team_id} className="mt-2" />
                                </div>

                                {/* ✅ 使用技術 (追加・削除可能) */}
                                <div className="mt-4">
                                    <InputLabel value="使用技術" />
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

                                {/* ✅ タグ (追加・削除可能) */}
                                <div className="mt-4">
                                    <InputLabel value="タグ" />
                                    {data.tags.map((tag, index) => (
                                        <div key={index} className="flex space-x-2 mt-2">
                                            <TextInput
                                                value={tag}
                                                className="w-full"
                                                onChange={(e) => updateTag(index, e.target.value)}
                                            />
                                            <button type="button" onClick={() => removeTag(index)} className="text-red-500">
                                                削除
                                            </button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={addTag} className="mt-2 text-blue-500">
                                        + タグを追加
                                    </button>
                                </div>

                                {/* ✅ ボタン */}
                                <div className="flex items-center justify-end mt-4 space-x-2">
                                    <Link href={route('mypage')} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                                        マイページに戻る
                                    </Link>
                                    <PrimaryButton disabled={processing}>プロジェクト作成</PrimaryButton>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
