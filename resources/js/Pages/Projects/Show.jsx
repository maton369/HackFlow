import { useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, project }) {
    // ✅ デバッグ用: project データをログに出力
    useEffect(() => {
        console.log("プロジェクトデータ:", project);
        console.log("チームのメンバー:", project.team?.members);
    }, [project]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{project.project_name}</h2>}
        >
            <Head title={project.project_name} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-semibold">プロジェクト詳細</h3>
                        <p className="mt-2 text-gray-700">{project.app_name}</p>
                        <p className="mt-2 text-gray-700">{project.project_image_url}</p>
                        <p className="mt-2 text-gray-700">
                            GitHub: <a href={project.github_url} className="text-blue-600 hover:underline">{project.github_url}</a>
                        </p>
                        <p className="mt-2 text-gray-700">
                            公開URL: <a href={project.live_url} className="text-blue-600 hover:underline">{project.live_url}</a>
                        </p>

                        <h4 className="mt-4 font-semibold">チーム</h4>
                        <p className="mt-2">{project.team?.team_name}</p>

                        <h4 className="mt-4 font-semibold">技術スタック</h4>
                        <ul className="mt-2">
                            {project.tech_stacks?.map((stack) => (
                                <li key={stack.id}>{stack.name}</li>
                            ))}
                        </ul>

                        <h4 className="mt-4 font-semibold">タグ</h4>
                        <ul className="mt-2">
                            {project.tags?.map((tag) => (
                                <li key={tag.id}>{tag.name}</li>
                            ))}
                        </ul>

                        {/* ✅ 修正: `project_steps` に変更 */}
                        <h4 className="mt-4 font-semibold">工程一覧</h4>
                        <ul className="mt-2">
                            {(project.project_steps ?? []).length > 0 ? (
                                project.project_steps.map((step) => (
                                    <li key={step.id} className="border-b py-2">
                                        <h4 className="font-semibold">{step.title}</h4>
                                        <p className="text-gray-600">{step.description}</p>
                                    </li>
                                ))
                            ) : (
                                <p className="text-gray-500">工程が登録されていません。</p>
                            )}
                        </ul>

                        {/* ✅ 編集ボタンを追加 (プロジェクトメンバーのみ表示) */}
                        {project.team?.members?.some(member => member.id === auth.user.id) && (
                            <div className="mt-6">
                                <Link
                                    href={route('projects.edit', project.id)}
                                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                >
                                    編集
                                </Link>
                            </div>
                        )}

                        <div className="mt-6">
                            <Link href={route('home')} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                ホームへ戻る
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
