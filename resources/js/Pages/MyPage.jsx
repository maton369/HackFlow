import { useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function MyPage({ auth }) {
    const user = auth.user;

    // ✅ コンポーネントがマウントされたときにユーザー情報をコンソールに出力
    useEffect(() => {
        console.log("🔍 マイページのユーザー情報:", user);
        console.log("🔍 技術スタック:", user.tech_stacks);
        console.log("🔍 関連URL:", user.urls);
        console.log(route('teams.create'));
    }, []);

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
                                        className="w-32 h-32 rounded-full mx-auto shadow"
                                    />
                                ) : (
                                    <p className="text-gray-500">プロフィール画像なし</p>
                                )}
                            </div>

                            {/* ✅ 基本情報 */}
                            <div className="mt-4">
                                <p><strong>名前:</strong> {user.name}</p>
                                <p><strong>メールアドレス:</strong> {user.email}</p>
                                <p><strong>登録日:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
                                <p><strong>自己紹介:</strong> {user.bio || "未登録"}</p>
                                <p><strong>技術レベル:</strong> {user.tech_level || "未設定"}</p>
                            </div>

                            {/* ✅ 技術スタック */}
                            <div className="mt-6">
                                <h4 className="font-semibold">技術スタック</h4>
                                {user.tech_stacks && Array.isArray(user.tech_stacks) && user.tech_stacks.length > 0 ? (
                                    <ul className="list-disc pl-5">
                                        {user.tech_stacks.map((stack, index) => (
                                            <li key={index}>{stack.name}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">未設定</p>
                                )}
                            </div>

                            {/* ✅ 関連URL */}
                            <div className="mt-6">
                                <h4 className="font-semibold">関連URL</h4>
                                {user.urls && Array.isArray(user.urls) && user.urls.length > 0 ? (
                                    <ul className="list-disc pl-5">
                                        {user.urls.map((url, index) => (
                                            <li key={index}>
                                                <a href={url.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                    {url.url_type}: {url.url}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">なし</p>
                                )}
                            </div>

                            {/* ✅ 所属チーム */}
                            <div className="mt-6">
                                <h4 className="font-semibold">所属チーム</h4>
                                {user.teams && user.teams.length > 0 ? (
                                    <ul className="list-disc pl-5">
                                        {user.teams.map(team => (
                                            <li key={team.id}>
                                                <Link
                                                    href={route('teams.show', team.id)}
                                                    className="text-blue-500 hover:underline"
                                                >
                                                    {team.team_name ? team.team_name : "チーム名不明"}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">未所属</p>
                                )}
                            </div>

                            {/* ✅ ボタン一覧 */}
                            <div className="mt-6 space-y-2">
                                <Link
                                    href={route('profile.edit')}
                                    className="block px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                >
                                    プロフィール編集
                                </Link>
                                <Link
                                    href={route('projects.create')}
                                    className="block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                    プロジェクト作成
                                </Link>
                                <Link
                                    href={route('teams.create')}
                                    className="block px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                                >
                                    チーム作成
                                </Link>
                                <Link
                                    href={route('statistics')}
                                    className="block px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                >
                                    統計ページ
                                </Link>
                                <Link
                                    href={route('home')}
                                    className="block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    ホームへ戻る
                                </Link>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
