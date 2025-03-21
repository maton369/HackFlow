import { useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function MyPage({ auth }) {
    const user = auth.user;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">マイページ</h2>}
        >
            <Head title="My Page" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <p className="text-gray-900 text-lg font-semibold">こんにちは、{user.name} さん！</p>

                        {/* ✅ ユーザー情報表示 */}
                        <div className="mt-6">
                            <h4 className="font-semibold">登録情報</h4>

                            {/* ✅ プロフィール画像 */}
                            <div className="mt-4 text-center">
                                {user.profile_image_url ? (
                                    <img
                                        src={user.profile_image_url}
                                        alt="プロフィール画像"
                                        className="w-32 h-32 rounded-full mx-auto shadow-lg border-4 border-gray-300"
                                    />
                                ) : (
                                    <div className="w-32 h-32 flex items-center justify-center bg-gray-200 rounded-full mx-auto shadow-lg">
                                        <span className="text-gray-600 text-sm">No Image</span>
                                    </div>
                                )}
                            </div>


                            {/* ✅ 基本情報 */}
                            <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-md">
                                <h4 className="font-semibold text-lg mb-4">基本情報</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    {/* 📛 名前 */}
                                    <div className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow">
                                        <span className="text-lg">👤</span>
                                        <p className="text-gray-700 font-medium">名前: {user.name}</p>
                                    </div>

                                    {/* 📅 登録日 */}
                                    <div className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow">
                                        <span className="text-lg">📅</span>
                                        <p className="text-gray-700 font-medium">登録日: {new Date(user.created_at).toLocaleDateString()}</p>
                                    </div>

                                    {/* 📝 自己紹介 */}
                                    <div className="flex items-start space-x-3 bg-white p-4 rounded-lg shadow col-span-1 md:col-span-2">
                                        <span className="text-lg">📝</span>
                                        <p className="text-gray-700 font-medium">自己紹介: {user.bio || "未登録"}</p>
                                    </div>

                                    {/* 💡 技術レベル */}
                                    <div className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow">
                                        <span className="text-lg">💡</span>
                                        <p className="text-gray-700 font-medium">技術レベル: {user.tech_level || "未設定"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* ✅ 技術スタック */}
                            <div className="mt-6">
                                <h4 className="font-semibold">技術スタック</h4>
                                {user.tech_stacks && user.tech_stacks.length > 0 ? (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {user.tech_stacks.map((stack, index) => (
                                            <span key={index} className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold shadow">
                                                {stack.name}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">未設定</p>
                                )}
                            </div>

                            {/* ✅ 関連URL */}
                            <div className="mt-4 flex flex-wrap justify-center gap-4">
                                <h4 className="font-semibold">関連URL</h4>
                                {user.urls.map((urlObj, index) => {
                                    let icon = "🔗"; // デフォルトのリンクアイコン
                                    if (urlObj.url.includes("github.com")) {
                                        icon = "🐱"; // GitHubアイコン
                                    } else if (urlObj.url.includes("twitter.com")) {
                                        icon = "🐦"; // Twitterアイコン
                                    }

                                    return (
                                        <a
                                            key={index}
                                            href={urlObj.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg shadow-md hover:bg-gray-200 transition border border-gray-300"
                                        >
                                            <span className="text-lg">{icon}</span>
                                            <span className="text-sm font-medium text-gray-700">{urlObj.url}</span>
                                        </a>
                                    );
                                })}
                            </div>

                            {/* ✅ 所属チーム */}
                            <div className="mt-6">
                                <h4 className="font-semibold">所属チーム</h4>
                                {user.teams && user.teams.length > 0 ? (
                                    <div className="flex flex-wrap gap-3 mt-2">
                                        {user.teams.map(team => (
                                            <Link
                                                key={team.id}
                                                href={route('teams.show', team.id)}
                                                className="bg-green-200 text-green-900 px-4 py-2 rounded-lg shadow hover:bg-green-300 transition"
                                            >
                                                {team.team_name || "チーム名不明"}
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">未所属</p>
                                )}
                            </div>

                            {/* ✅ 関係するプロジェクト一覧 */}
                            <div className="mt-6">
                                <h4 className="font-semibold">関係するプロジェクト</h4>
                                {user.projects && user.projects.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                                        {user.projects.map(project => (
                                            <Link
                                                key={project.id}
                                                href={route('projects.show', project.id)}
                                                className="block bg-blue-100 text-blue-900 px-4 py-3 rounded-lg shadow hover:bg-blue-200 transition"
                                            >
                                                {project.project_name} ({project.team?.team_name || "チームなし"})
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">関係するプロジェクトがありません。</p>
                                )}
                            </div>

                            {/* ✅ いいねしたプロジェクト一覧 */}
                            <div className="mt-6">
                                <h4 className="font-semibold">いいねしたプロジェクト</h4>
                                {user.liked_projects && user.liked_projects.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                                        {user.liked_projects.map(project => (
                                            <Link
                                                key={project.id}
                                                href={route('projects.show', project.id)}
                                                className="block bg-pink-100 text-pink-900 px-4 py-3 rounded-lg shadow hover:bg-pink-200 transition"
                                            >
                                                ❤️ {project.project_name} ({project.team?.team_name || "チームなし"})
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">いいねしたプロジェクトがありません。</p>
                                )}
                            </div>


                            {/* ✅ ボタン一覧 */}
                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <Link
                                    href={route('profile.edit')}
                                    className="flex items-center justify-center px-4 py-3 bg-yellow-400 text-black font-semibold rounded-lg shadow hover:bg-yellow-500 transition"
                                >
                                    ✏️ プロフィール編集
                                </Link>
                                <Link
                                    href={route('projects.create')}
                                    className="flex items-center justify-center px-4 py-3 bg-green-400 text-black font-semibold rounded-lg shadow hover:bg-green-500 transition"
                                >
                                    📁 プロジェクト作成
                                </Link>
                                <Link
                                    href={route('teams.create')}
                                    className="flex items-center justify-center px-4 py-3 bg-purple-400 text-white font-semibold rounded-lg shadow hover:bg-purple-500 transition"
                                >
                                    👥 チーム作成
                                </Link>
                                <Link
                                    href={route('statistics')}
                                    className="flex items-center justify-center px-4 py-3 bg-gray-400 text-white font-semibold rounded-lg shadow hover:bg-gray-500 transition"
                                >
                                    📊 統計ページ
                                </Link>
                                <Link
                                    href={route('home')}
                                    className="flex items-center justify-center px-4 py-3 bg-blue-400 text-white font-semibold rounded-lg shadow hover:bg-blue-500 transition"
                                >
                                    🏠 ホームへ戻る
                                </Link>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
