import { useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, user }) {
    // ✅ コンポーネントがマウントされたときにデータをログに出力
    useEffect(() => {
        console.log("✅ 受け取ったユーザーデータ:", user);
    }, [user]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{user.name} のプロフィール</h2>}
        >
            <Head title={`${user.name} のプロフィール`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <p className="text-gray-900 text-lg">ユーザー情報</p>

                        {/* ✅ プロフィール画像 */}
                        <div className="mt-4 text-center">
                            {user.profile_image_url ? (
                                <img src={user.profile_image_url} alt="プロフィール画像" className="w-32 h-32 rounded-full mx-auto shadow" />
                            ) : (
                                <p className="text-gray-500">プロフィール画像なし</p>
                            )}
                        </div>

                        {/* ✅ 基本情報 */}
                        <div className="mt-4">
                            <p><strong>名前:</strong> {user.name}</p>
                            <p><strong>メールアドレス:</strong> {user.email}</p>
                            <p><strong>登録日:</strong> {user.created_at ? new Date(user.created_at).toLocaleDateString() : "不明"}</p>
                            <p><strong>自己紹介:</strong> {user.bio || "N/A"}</p>
                            <p><strong>技術レベル:</strong> {user.tech_level || "N/A"}</p>
                        </div>

                        {/* ✅ 技術スタック */}
                        <div className="mt-6">
                            <h4 className="font-semibold">技術スタック</h4>
                            {user.tech_stacks && user.tech_stacks.length > 0 ? (  // ✅ 修正: `user.techStacks → user.tech_stacks`
                                <ul className="list-disc pl-5">
                                    {user.tech_stacks.map(stack => (
                                        <li key={stack.id}>{stack.name || "不明な技術"}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">技術スタックが登録されていません。</p>
                            )}
                        </div>



                        {/* ✅ 関連URL */}
                        <div className="mt-6">
                            <h4 className="font-semibold">関連URL</h4>
                            {user.urls && user.urls.length > 0 ? ( // ✅ `user.urls` が `undefined` の場合に備える
                                <ul className="list-disc pl-5">
                                    {user.urls.map(url => (
                                        <li key={url.id}>
                                            <a href={url.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                {url.url_type || "その他"}: {url.url}
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
                                        <li key={team.id}>{team.name ? team.name : team.team_name || "チーム名不明"}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">未所属</p>
                            )}

                        </div>

                        {/* ✅ 戻るボタン */}
                        <div className="mt-6 space-y-2">
                            <Link href={route('home')} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                ホームへ戻る
                            </Link>
                            <Link href={route('mypage')} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                                マイページ
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
