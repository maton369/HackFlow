import { useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, user }) {
    // ✅ デバッグ用ログ
    useEffect(() => {
        console.log("✅ 受け取ったユーザーデータ:", user);
        console.log("✅ 認証ユーザー:", auth.user);
    }, [user, auth]);

    const Layout = auth.user ? AuthenticatedLayout : GuestLayout;

    return (
        <Layout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{user.name} のプロフィール</h2>}
        >
            <Head title={`${user.name} のプロフィール`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <p className="text-gray-900 text-lg">ユーザー情報</p>

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

                        <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-md">
                            <h4 className="font-semibold text-lg mb-4">基本情報</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow">
                                    <span className="text-lg">👤</span>
                                    <p className="text-gray-700 font-medium">名前: {user.name}</p>
                                </div>
                                <div className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow">
                                    <span className="text-lg">📧</span>
                                    <p className="text-gray-700 font-medium">
                                        メール: {auth.user ? user.email : "ログインすると閲覧できます"}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow">
                                    <span className="text-lg">📅</span>
                                    <p className="text-gray-700 font-medium">
                                        登録日: {user.created_at ? new Date(user.created_at).toLocaleDateString() : "不明"}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow">
                                    <span className="text-lg">💡</span>
                                    <p className="text-gray-700 font-medium">技術レベル: {user.tech_level || "N/A"}</p>
                                </div>
                                <div className="col-span-full flex items-start space-x-3 bg-white p-4 rounded-lg shadow">
                                    <span className="text-lg">📝</span>
                                    <p className="text-gray-700 font-medium">自己紹介: {user.bio || "N/A"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h4 className="font-semibold">技術スタック</h4>
                            {user.tech_stacks?.length > 0 ? (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {user.tech_stacks.map(stack => (
                                        <span key={stack.id} className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold shadow">
                                            {stack.name}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">技術スタックが登録されていません。</p>
                            )}
                        </div>

                        <div className="mt-6">
                            <h4 className="font-semibold mb-2">関連URL</h4>
                            <div className="flex flex-wrap gap-3">
                                {user.urls?.length > 0 ? (
                                    user.urls.map(url => {
                                        let icon = "🔗";
                                        if (url.url.includes("github.com")) icon = "🐱";
                                        else if (url.url.includes("twitter.com")) icon = "🐦";

                                        return (
                                            <a
                                                key={url.id}
                                                href={url.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg shadow-md hover:bg-gray-200 transition border border-gray-300"
                                            >
                                                <span className="text-lg">{icon}</span>
                                                <span className="text-sm font-medium text-gray-700">{url.url}</span>
                                            </a>
                                        );
                                    })
                                ) : (
                                    <p className="text-gray-500">なし</p>
                                )}
                            </div>
                        </div>

                        <div className="mt-6">
                            <h4 className="font-semibold">所属チーム</h4>
                            {user.teams?.length > 0 ? (
                                <div className="flex flex-wrap gap-3 mt-2">
                                    {user.teams.map(team => (
                                        <Link
                                            key={team.id}
                                            href={route('teams.show', team.id)}
                                            className="bg-green-200 text-green-900 px-4 py-2 rounded-lg shadow hover:bg-green-300 transition"
                                        >
                                            {team.name || "チーム名不明"}
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">未所属</p>
                            )}
                        </div>

                        {/* ✅ ナビゲーションボタン */}
                        <div className="mt-6 space-y-2">
                            <Link href={route('home')} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                ホームへ戻る
                            </Link>

                            {auth.user && (
                                <Link href={route('mypage')} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                                    マイページ
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
