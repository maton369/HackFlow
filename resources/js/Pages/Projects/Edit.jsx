import { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ auth, project }) {
    // ✅ デバッグ用: データをログに出力
    useEffect(() => {
        console.log("✅ プロジェクトデータ:", project);
    }, [project]);

    const { data, setData, patch, processing, errors } = useForm({
        project_name: project.project_name,
        project_image: null,
        project_image_url: project.project_image_url || '',
        github_url: project.github_url || '',
        live_url: project.live_url || '',
        team_name: project.team.name, // 編集不可
        tech_stacks: project.tech_stacks ?? [],
        tags: project.tags ?? [],
        project_steps: project.project_steps ?? [], // 🔹 工程リストを追加
    });

    // 🔥 画像プレビュー用の state を追加
    const [previewImage, setPreviewImage] = useState(data.project_image_url || '');
    const [isLoading, setIsLoading] = useState(false);

    // 🔥 画像選択時の処理
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setData('project_image', file);

        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setPreviewImage(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // ✅ 技術スタックの追加・削除
    const addTechStack = () => {
        setData('tech_stacks', [...data.tech_stacks, { id: null, name: '' }]);
    };
    const removeTechStack = (index) => {
        setData('tech_stacks', data.tech_stacks.filter((_, i) => i !== index));
    };

    // ✅ タグの追加・削除
    const addTag = () => {
        setData('tags', [...data.tags, { id: null, name: '' }]);
    };
    const removeTag = (index) => {
        setData('tags', data.tags.filter((_, i) => i !== index));
    };

    // ✅ 工程の追加・削除
    const addStep = () => {
        setData('project_steps', [...data.project_steps, { id: null, title: '', description: '' }]);
    };
    const removeStep = (index) => {
        setData('project_steps', data.project_steps.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 🔥 必須項目のチェック
        if (!data.project_name.trim()) {
            alert("⚠️ プロジェクト名を入力してください！");
            return;
        }

        setIsLoading(true); // 🔥 ローディング開始

        const formData = new FormData();
        formData.append('_method', 'PATCH');
        formData.append('project_name', data.project_name);
        formData.append('github_url', data.github_url || '');
        formData.append('live_url', data.live_url || '');

        if (data.project_image) {
            formData.append('project_image', data.project_image);
        }

        data.tech_stacks.forEach(stack => formData.append('tech_stacks[]', stack.name));
        data.tags.forEach(tag => formData.append('tags[]', tag.name));

        data.project_steps.forEach((step, index) => {
            formData.append(`project_steps[${index}][id]`, step.id ?? '');
            formData.append(`project_steps[${index}][title]`, step.title);
            formData.append(`project_steps[${index}][description]`, step.description);
        });

        console.log("📡 送信データ:", [...formData.entries()]);

        patch(route('projects.update', { project: project.id }), formData, {
            onSuccess: () => {
                console.log("✅ 更新成功");
                setIsLoading(false); // 🔥 ローディング終了
            },
            onError: (errors) => {
                console.error("❌ 更新エラー:", errors);
                setIsLoading(false); // 🔥 ローディング終了
            },
        });
    };



    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">プロジェクト編集</h2>}
        >
            <Head title="プロジェクト編集" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-semibold">プロジェクト編集</h3>

                        {/* ✅ ローディングスピナー */}
                        {isLoading && (
                            <div className="flex justify-center items-center h-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
                            </div>
                        )}

                        {!isLoading && (
                            <form onSubmit={handleSubmit}>
                                {/* ✅ プロジェクト情報 */}
                                <div>
                                    <label className="block font-medium text-sm text-gray-700">プロジェクト名</label>
                                    <input
                                        type="text"
                                        value={data.project_name}
                                        onChange={(e) => setData('project_name', e.target.value)}
                                        className="border-gray-300 rounded-md shadow-sm w-full"
                                    />
                                </div>

                                {/* ✅ 画像アップロード */}
                                <div className="mt-4">
                                    <label className="block font-medium text-sm text-gray-700">プロジェクト画像</label>
                                    <input type="file" onChange={handleFileChange} accept="image/*" className="mt-1 block w-full" />
                                    {previewImage && <img src={previewImage} alt="画像プレビュー" className="mt-2 w-32 h-32 rounded" />}
                                </div>

                                <div className="mt-4">
                                    <label className="block font-medium text-sm text-gray-700">GitHub URL</label>
                                    <input
                                        type="url"
                                        value={data.github_url}
                                        onChange={(e) => setData('github_url', e.target.value)}
                                        className="border-gray-300 rounded-md shadow-sm w-full"
                                    />
                                </div>

                                <div className="mt-4">
                                    <label className="block font-medium text-sm text-gray-700">公開 URL</label>
                                    <input
                                        type="url"
                                        value={data.live_url}
                                        onChange={(e) => setData('live_url', e.target.value)}
                                        className="border-gray-300 rounded-md shadow-sm w-full"
                                    />
                                </div>

                                {/* ✅ 技術スタックの編集 */}
                                <div className="mt-6">
                                    <h4 className="font-semibold">技術スタック</h4>
                                    {data.tech_stacks.map((stack, index) => (
                                        <div key={index} className="flex items-center mt-2">
                                            <input
                                                type="text"
                                                value={stack.name}
                                                onChange={(e) => {
                                                    const newTechStacks = [...data.tech_stacks];
                                                    newTechStacks[index].name = e.target.value;
                                                    setData('tech_stacks', newTechStacks);
                                                }}
                                                className="border-gray-300 rounded-md shadow-sm w-full"
                                                placeholder="技術スタック名"
                                            />
                                            <button type="button" className="ml-2 bg-red-500 text-white px-2 py-1 rounded" onClick={() => removeTechStack(index)}>
                                                削除
                                            </button>
                                        </div>
                                    ))}
                                    <button type="button" className="mt-2 bg-green-500 text-white px-3 py-1 rounded" onClick={addTechStack}>
                                        追加
                                    </button>
                                </div>

                                {/* ✅ タグの編集 */}
                                <div className="mt-6">
                                    <h4 className="font-semibold">タグ</h4>
                                    {data.tags.map((tag, index) => (
                                        <div key={index} className="flex items-center mt-2">
                                            <input
                                                type="text"
                                                value={tag.name}
                                                onChange={(e) => {
                                                    const newTags = [...data.tags];
                                                    newTags[index].name = e.target.value;
                                                    setData('tags', newTags);
                                                }}
                                                className="border-gray-300 rounded-md shadow-sm w-full"
                                                placeholder="タグ名"
                                            />
                                            <button type="button" className="ml-2 bg-red-500 text-white px-2 py-1 rounded" onClick={() => removeTag(index)}>
                                                削除
                                            </button>
                                        </div>
                                    ))}
                                    <button type="button" className="mt-2 bg-green-500 text-white px-3 py-1 rounded" onClick={addTag}>
                                        追加
                                    </button>
                                </div>

                                {/* ✅ 工程の編集 */}
                                <div className="mt-6">
                                    <h4 className="font-semibold">工程</h4>
                                    {data.project_steps.map((step, index) => (
                                        <div key={index} className="mt-2">
                                            <input
                                                type="text"
                                                value={step.title}
                                                onChange={(e) => {
                                                    const newSteps = [...data.project_steps];
                                                    newSteps[index].title = e.target.value;
                                                    setData('project_steps', newSteps);
                                                }}
                                                className="border-gray-300 rounded-md shadow-sm w-full"
                                                placeholder="工程タイトル"
                                            />
                                            <textarea
                                                value={step.description}
                                                onChange={(e) => {
                                                    const newSteps = [...data.project_steps];
                                                    newSteps[index].description = e.target.value;
                                                    setData('project_steps', newSteps);
                                                }}
                                                className="border-gray-300 rounded-md shadow-sm w-full mt-2"
                                                placeholder="工程の説明"
                                            />
                                            <button type="button" className="ml-2 bg-red-500 text-white px-2 py-1 rounded mt-2" onClick={() => removeStep(index)}>
                                                削除
                                            </button>
                                        </div>
                                    ))}
                                    <button type="button" className="mt-2 bg-green-500 text-white px-3 py-1 rounded" onClick={addStep}>
                                        追加
                                    </button>
                                </div>

                                <button type="submit" className="mt-6 bg-blue-500 text-white px-4 py-2 rounded">
                                    更新
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
