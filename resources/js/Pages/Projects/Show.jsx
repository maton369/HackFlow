import { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import axios from 'axios';

export default function Show({ auth, project }) {
    const { delete: destroy, processing } = useForm();
    const isAuthenticated = auth.user !== null;

    // ✅ いいね状態といいね数を管理
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(project.like_count || 0);

    useEffect(() => {
        console.log("✅ プロジェクトデータ:", project);
        console.log("✅ チームのメンバー:", project.team?.users);
        console.log("✅ 認証ユーザー:", auth.user);

        // ✅ いいね数は誰でも取得できるようにする
        axios.get(`/projects/${project.id}/like-count`)
            .then((response) => {
                setLikeCount(response.data.count);
            })
            .catch((error) => {
                console.error("Failed to fetch like count:", error);
            });

        // ✅ いいね済みかどうかはログインユーザーのみ取得
        if (isAuthenticated) {
            axios.get(`/projects/${project.id}/is-liked`)
                .then((response) => {
                    setIsLiked(response.data.liked); // ✅ `setLiked` → `setIsLiked` に修正
                })
                .catch((error) => {
                    console.error("❌ いいね状態の取得に失敗:", error);
                });
        }
    }, [project, isAuthenticated]);

    const toggleLike = async () => {
        if (!isAuthenticated) {
            alert("ログインが必要です");
            return;
        }

        console.log(`👍 いいねボタンが押されました！(ID: ${project.id})`);

        // ✅ UIを即時更新
        setIsLiked((prev) => !prev);
        setLikeCount((prev) => (!isLiked ? prev + 1 : prev - 1));

        try {
            const response = await axios.post(`/projects/${project.id}/like`);
            console.log("✅ APIレスポンス:", response.data);

            // ✅ APIの結果を反映（確定処理）
            setIsLiked(response.data.liked);
            setLikeCount((prev) => (response.data.liked ? prev : prev));
        } catch (error) {
            console.error("❌ いいねの切り替えに失敗:", error);

            // ✅ エラー時には元の状態に戻す
            setIsLiked((prev) => !prev);
            setLikeCount((prev) => (!isLiked ? prev - 1 : prev + 1));
        }
    };

    // ✅ ユーザーがプロジェクトのリーダーか判定
    const isLeader = isAuthenticated
        ? (project.team?.users ?? []).some(user => user.id === auth.user.id && user.pivot?.role === 'owner')
        : false;

    console.log("🔥 isLeader 判定:", isLeader);

    // ✅ プロジェクト削除処理
    const handleDelete = () => {
        if (confirm("本当にこのプロジェクトを削除しますか？ この操作は元に戻せません。")) {
            destroy(route('projects.destroy', project.id), {
                onSuccess: () => router.visit(route('home')),
            });
        }
    };

    return isAuthenticated ? (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{project.project_name}</h2>}
        >
            <Head title={project.project_name} />

            <div className="py-12 bg-[#1e1e1e] min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-[#2c2c2c] bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">

                        {project.project_image_url ? (
                            <img
                                src={project.project_image_url}
                                alt="プロジェクト画像"
                                className="mt-4 w-full max-w-md mx-auto rounded-xl shadow-lg object-cover"
                            />
                        ) : (
                            <div className="mt-4 w-full max-w-md mx-auto h-48 bg-gray-200 flex items-center justify-center rounded-xl text-gray-500">
                                No Image
                            </div>
                        )}

                        <div className="mt-6 space-y-2 text-black">
                            <p>📛 アプリ名: <span className="font-semibold">{project.app_name || "未設定"}</span></p>
                            <p>
                                🔗 GitHub:{" "}
                                {project.github_url ? (
                                    <a href={project.github_url} className="text-blue-300 hover:underline" target="_blank" rel="noopener noreferrer">
                                        {project.github_url}
                                    </a>
                                ) : "未登録"}
                            </p>
                            <p>
                                🌍 公開URL:{" "}
                                {project.live_url ? (
                                    <a href={project.live_url} className="text-blue-300 hover:underline" target="_blank" rel="noopener noreferrer">
                                        {project.live_url}
                                    </a>
                                ) : "未登録"}
                            </p>
                        </div>


                        <div className="mt-6 flex items-center space-x-3">
                            <button
                                onClick={toggleLike}
                                className={`text-2xl transition transform ${isLiked ? "text-pink-500 scale-110" : "text-gray-400"}`}
                                title="いいね"
                            >
                                {isLiked ? "❤️" : "🤍"}
                            </button>
                            <span className="text-black font-semibold">{likeCount}</span>
                        </div>

                        <div className="mt-8">
                            <h4 className="text-lg font-bold text-black mb-2">👥 チーム</h4>
                            {project.team ? (
                                <Link href={route('teams.show', project.team.id)} className="text-blue-400 hover:underline">
                                    {project.team.team_name}
                                </Link>
                            ) : (
                                <p className="text-gray-400">チーム未所属</p>
                            )}
                        </div>

                        <div className="mt-6">
                            <h4 className="text-lg font-bold text-black mb-2">🛠 技術スタック</h4>
                            {(project.tech_stacks ?? []).length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {project.tech_stacks.map(stack => (
                                        <span key={stack.id} className="bg-blue-300 text-blue-900 px-3 py-1 rounded-full text-sm shadow">
                                            {stack.name}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400">未登録</p>
                            )}
                        </div>

                        <div className="mt-6">
                            <h4 className="text-lg font-bold text-black mb-2">🏷 タグ</h4>
                            {(project.tags ?? []).length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map(tag => (
                                        <span key={tag.id} className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm shadow">
                                            {tag.name}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400">未登録</p>
                            )}
                        </div>


                        <div className="mt-8">
                            <h4 className="text-lg font-bold text-black mb-4">🗂 工程一覧</h4>
                            {(project.project_steps ?? []).length > 0 ? (
                                <div className="space-y-6 relative">
                                    {project.project_steps.map((step, index) => (
                                        <div key={step.id} className="relative">
                                            {/* ステップ表示 */}
                                            <div className="bg-gray-800 p-4 rounded-lg shadow text-white">
                                                <h5 className="font-semibold text-lg">{step.title}</h5>
                                                <p className="mt-2 text-sm text-gray-200">{step.description}</p>
                                            </div>

                                            {/* ↓ 矢印の表示（最後の工程以外） */}
                                            {index !== project.project_steps.length - 1 && (
                                                <div className="flex justify-center my-2 text-black text-xl">
                                                    ↓
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-white">工程が登録されていません。</p>
                            )}
                        </div>

                        <div className="mt-8 flex flex-wrap gap-4">
                            {(project.team?.users ?? []).some(user => user.id === auth.user.id) && (
                                <>
                                    <Link
                                        href={route('projects.edit', project.id)}
                                        className="bg-yellow-400 text-black px-4 py-2 rounded shadow hover:bg-yellow-500 transition"
                                    >
                                        ✏️ 編集
                                    </Link>
                                    {isLeader && (
                                        <button
                                            onClick={handleDelete}
                                            className="bg-red-500 text-black px-4 py-2 rounded shadow hover:bg-red-600 transition"
                                            disabled={processing}
                                        >
                                            🗑️ 削除
                                        </button>
                                    )}
                                </>
                            )}
                            <Link
                                href={route('home')}
                                className="bg-blue-500 text-black px-4 py-2 rounded shadow hover:bg-blue-600 transition"
                            >
                                🏠 ホームへ戻る
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    ) : (
        <GuestLayout>
            <Head title={project.project_name} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-semibold">プロジェクト詳細</h3>

                        {project.project_image_url ? (
                            <img
                                src={project.project_image_url}
                                alt="プロジェクト画像"
                                className="mt-4 w-full max-w-md mx-auto rounded-xl shadow-lg object-cover"
                            />
                        ) : (
                            <div className="mt-4 w-full max-w-md mx-auto h-48 bg-gray-200 flex items-center justify-center rounded-xl text-gray-500">
                                No Image
                            </div>
                        )}

                        <div className="mt-6 space-y-2 text-black">
                            <p>📛 アプリ名: <span className="font-semibold">{project.app_name || "未設定"}</span></p>
                            <p>
                                🔗 GitHub:{" "}
                                {project.github_url ? (
                                    <a href={project.github_url} className="text-blue-300 hover:underline" target="_blank" rel="noopener noreferrer">
                                        {project.github_url}
                                    </a>
                                ) : "未登録"}
                            </p>
                            <p>
                                🌍 公開URL:{" "}
                                {project.live_url ? (
                                    <a href={project.live_url} className="text-blue-300 hover:underline" target="_blank" rel="noopener noreferrer">
                                        {project.live_url}
                                    </a>
                                ) : "未登録"}
                            </p>
                        </div>

                        {/* ✅ いいね機能 */}
                        <div className="mt-4 flex items-center">
                            <span className="text-gray-600 mr-2">{likeCount} いいね</span>
                        </div>


                        <div className="mt-8">
                            <h4 className="text-lg font-bold text-black mb-2">👥 チーム</h4>
                            {project.team ? (
                                <Link href={route('teams.show', project.team.id)} className="text-blue-400 hover:underline">
                                    {project.team.team_name}
                                </Link>
                            ) : (
                                <p className="text-gray-400">チーム未所属</p>
                            )}
                        </div>

                        <div className="mt-6">
                            <h4 className="text-lg font-bold text-black mb-2">🛠 技術スタック</h4>
                            {(project.tech_stacks ?? []).length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {project.tech_stacks.map(stack => (
                                        <span key={stack.id} className="bg-blue-300 text-blue-900 px-3 py-1 rounded-full text-sm shadow">
                                            {stack.name}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400">未登録</p>
                            )}
                        </div>

                        <div className="mt-6">
                            <h4 className="text-lg font-bold text-black mb-2">🏷 タグ</h4>
                            {(project.tags ?? []).length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map(tag => (
                                        <span key={tag.id} className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm shadow">
                                            {tag.name}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400">未登録</p>
                            )}
                        </div>


                        <div className="mt-8">
                            <h4 className="text-lg font-bold text-black mb-4">🗂 工程一覧</h4>
                            {(project.project_steps ?? []).length > 0 ? (
                                <div className="space-y-6 relative">
                                    {project.project_steps.map((step, index) => (
                                        <div key={step.id} className="relative">
                                            {/* ステップ表示 */}
                                            <div className="bg-gray-800 p-4 rounded-lg shadow text-black">
                                                <h5 className="font-semibold text-lg">{step.title}</h5>
                                                <p className="mt-2 text-sm text-gray-200">{step.description}</p>
                                            </div>

                                            {/* ↓ 矢印の表示（最後の工程以外） */}
                                            {index !== project.project_steps.length - 1 && (
                                                <div className="flex justify-center my-2 text-black text-xl">
                                                    ↓
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-black">工程が登録されていません。</p>
                            )}
                        </div>



                        <div className="mt-8 flex flex-wrap gap-4">
                            <Link
                                href={route('home')}
                                className="bg-blue-500 text-black px-4 py-2 rounded shadow hover:bg-blue-600 transition"
                            >
                                🏠 ホームへ戻る
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
