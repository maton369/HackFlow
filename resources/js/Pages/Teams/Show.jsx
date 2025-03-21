import { useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Show({ auth, team }) {
    const { delete: destroy, processing } = useForm();

    useEffect(() => {
        console.log("✅ チームデータ:", team);
        console.log("✅ チームメンバー:", team.members);
        console.log("✅ 認証ユーザー:", auth.user);
        console.log("✅ チームの関連プロジェクト:", team.projects);
    }, [team, auth]);

    // 🔥 ログインユーザーがリーダーか判定
    const isLeader = auth.user && team.members.some(member => member.user?.id === auth.user.id && member.role === 'owner');

    // ✅ チーム削除処理（手動削除のみ）
    const handleDelete = () => {
        if (confirm("本当にこのチームを削除しますか？ この操作は元に戻せません。")) {
            destroy(route('teams.destroy', team.id), {
                onSuccess: () => {
                    console.log("✅ チーム削除完了！");
                    router.visit(route('home'));
                },
                onError: (error) => {
                    console.error("❌ チーム削除エラー:", error);
                },
            });
        }
    };

    return auth.user ? (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{team.team_name}</h2>}
        >
            <Head title={team.team_name} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">

                        {team.team_image_url && (
                            <div className="mb-6 text-center">
                                <img
                                    src={team.team_image_url}
                                    alt="チーム画像"
                                    className="w-40 h-40 rounded-full mx-auto border-4 border-blue-300 shadow-lg object-cover"
                                />
                            </div>
                        )}

                        <div className="mt-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">👥 チームメンバー</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {team.members.length > 0 ? (
                                    team.members.map(member => (
                                        <div key={member.id} className="bg-white border rounded-lg p-4 shadow">
                                            {member.user ? (
                                                <Link
                                                    href={route('users.show', member.user.id)}
                                                    className="text-blue-600 font-semibold hover:underline"
                                                >
                                                    {member.user.name}
                                                </Link>
                                            ) : (
                                                <span className="text-gray-500">メンバー情報なし</span>
                                            )}
                                            <p className="text-sm text-gray-600 mt-1">役割: {member.role}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">メンバーがいません。</p>
                                )}
                            </div>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">📁 関連プロジェクト</h3>
                            {team.projects.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {team.projects.map(project => (
                                        <Link
                                            key={project.id}
                                            href={route('projects.show', project.id)}
                                            className="bg-blue-100 hover:bg-blue-200 transition p-4 rounded-lg shadow flex flex-col justify-between"
                                        >
                                            <span className="font-semibold text-lg text-blue-900">{project.project_name}</span>
                                            <span className="text-sm text-gray-700 mt-2">{project.likes_count ?? 0} いいね</span>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">関連プロジェクトがありません。</p>
                            )}
                        </div>



                        {isLeader && (
                            <div className="mt-6 flex flex-wrap gap-4">
                                <Link
                                    href={route('teams.edit', team.id)}
                                    className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded shadow hover:bg-yellow-500 transition"
                                >
                                    ✏️ チーム編集
                                </Link>
                                <button
                                    onClick={handleDelete}
                                    className="bg-red-500 text-white font-semibold px-4 py-2 rounded shadow hover:bg-red-600 transition"
                                    disabled={processing}
                                >
                                    🗑️ チーム削除
                                </button>
                            </div>
                        )}


                        <div className="mt-8 flex flex-wrap gap-4">
                            <Link
                                href={route('mypage')}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                            >
                                マイページへ戻る
                            </Link>
                            <Link
                                href={route('home')}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                            >
                                ホームへ戻る
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    ) : (
        <GuestLayout>
            <Head title={team.team_name} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">

                        {team.team_image_url && (
                            <div className="mb-6 text-center">
                                <img
                                    src={team.team_image_url}
                                    alt="チーム画像"
                                    className="w-40 h-40 rounded-full mx-auto border-4 border-blue-300 shadow-lg object-cover"
                                />
                            </div>
                        )}

                        <div className="mt-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">👥 チームメンバー</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {team.members.length > 0 ? (
                                    team.members.map(member => (
                                        <div key={member.id} className="bg-white border rounded-lg p-4 shadow">
                                            {member.user ? (
                                                <Link
                                                    href={route('users.show', member.user.id)}
                                                    className="text-blue-600 font-semibold hover:underline"
                                                >
                                                    {member.user.name}
                                                </Link>
                                            ) : (
                                                <span className="text-gray-500">メンバー情報なし</span>
                                            )}
                                            <p className="text-sm text-gray-600 mt-1">役割: {member.role}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">メンバーがいません。</p>
                                )}
                            </div>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">📁 関連プロジェクト</h3>
                            {team.projects.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {team.projects.map(project => (
                                        <Link
                                            key={project.id}
                                            href={route('projects.show', project.id)}
                                            className="bg-blue-100 hover:bg-blue-200 transition p-4 rounded-lg shadow flex flex-col justify-between"
                                        >
                                            <span className="font-semibold text-lg text-blue-900">{project.project_name}</span>
                                            <span className="text-sm text-gray-700 mt-2">{project.likes_count ?? 0} いいね</span>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">関連プロジェクトがありません。</p>
                            )}
                        </div>


                        <div className="mt-8 flex flex-wrap gap-4">
                            <Link
                                href={route('mypage')}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                            >
                                マイページへ戻る
                            </Link>
                            <Link
                                href={route('home')}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                            >
                                ホームへ戻る
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
