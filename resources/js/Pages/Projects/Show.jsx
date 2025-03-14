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

                        {/* ✅ いいね機能 */}
                        <div className="mt-4 flex items-center">
                            <button
                                onClick={toggleLike}
                                className={`transition-all duration-300 transform ${isLiked ? "text-pink-500 scale-110" : "text-gray-500"}`}
                            >
                                {isLiked ? "❤️" : "🤍"}
                            </button>
                            <span className="ml-2 text-gray-600">{likeCount}</span>
                        </div>

                        <h4 className="mt-4 font-semibold">チーム</h4>
                        {project.team ? (
                            <p className="mt-2">
                                <Link href={route('teams.show', project.team.id)} className="text-blue-500 hover:underline">
                                    {project.team.team_name}
                                </Link>
                            </p>
                        ) : (
                            <p className="text-gray-500">チームなし</p>
                        )}

                        <h4 className="mt-4 font-semibold">技術スタック</h4>
                        <ul className="mt-2">
                            {(project.tech_stacks ?? []).length > 0 ? (
                                project.tech_stacks.map((stack) => (
                                    <li key={stack.id}>{stack.name}</li>
                                ))
                            ) : (
                                <p className="text-gray-500">技術スタックがありません。</p>
                            )}
                        </ul>

                        <h4 className="mt-4 font-semibold">タグ</h4>
                        <ul className="mt-2">
                            {(project.tags ?? []).length > 0 ? (
                                project.tags.map((tag) => (
                                    <li key={tag.id}>{tag.name}</li>
                                ))
                            ) : (
                                <p className="text-gray-500">タグがありません。</p>
                            )}
                        </ul>

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

                        {/* ✅ チームメンバーのみ編集ボタンを表示 */}
                        {(project.team?.users ?? []).some(user => user.id === auth.user.id) && (
                            <div className="mt-6 space-x-2">
                                <Link
                                    href={route('projects.edit', project.id)}
                                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                >
                                    編集
                                </Link>
                                {/* ✅ リーダーのみ削除ボタンを表示 */}
                                {isLeader && (
                                    <button
                                        onClick={handleDelete}
                                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                        disabled={processing}
                                    >
                                        削除
                                    </button>
                                )}
                            </div>
                        )}

                        {/* ✅ ホームに戻るボタン */}
                        <div className="mt-6">
                            <Link href={route('home')} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                ホームへ戻る
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
                        <p className="mt-2 text-gray-700">{project.app_name}</p>

                        <p className="mt-2 text-gray-700">{project.project_image_url}</p>
                        <p className="mt-2 text-gray-700">
                            GitHub: <a href={project.github_url} className="text-blue-600 hover:underline">{project.github_url}</a>
                        </p>
                        <p className="mt-2 text-gray-700">
                            公開URL: <a href={project.live_url} className="text-blue-600 hover:underline">{project.live_url}</a>
                        </p>

                        <h4 className="mt-4 font-semibold">技術スタック</h4>
                        <ul className="mt-2">
                            {(project.tech_stacks ?? []).length > 0 ? (
                                project.tech_stacks.map((stack) => (
                                    <li key={stack.id}>{stack.name}</li>
                                ))
                            ) : (
                                <p className="text-gray-500">技術スタックがありません。</p>
                            )}
                        </ul>

                        <h4 className="mt-4 font-semibold">タグ</h4>
                        <ul className="mt-2">
                            {(project.tags ?? []).length > 0 ? (
                                project.tags.map((tag) => (
                                    <li key={tag.id}>{tag.name}</li>
                                ))
                            ) : (
                                <p className="text-gray-500">タグがありません。</p>
                            )}
                        </ul>

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

                        {/* ✅ いいね機能 */}
                        <div className="mt-4 flex items-center">
                            <span className="text-gray-600 mr-2">{likeCount} いいね</span>
                        </div>

                        {/* ✅ ホームに戻るボタン */}
                        <div className="mt-6">
                            <Link href={route('home')} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                                ホームへ戻る
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
