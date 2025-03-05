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
                        <h3 className="text-lg font-semibold">チームメンバー</h3>
                        <ul className="mt-4">
                            {team.members.length > 0 ? (
                                team.members.map(member => (
                                    <li key={member.id} className="py-2">
                                        {member.user ? (
                                            <Link href={route('users.show', member.user.id)} className="text-blue-500 hover:underline">
                                                {member.user.name}
                                            </Link>
                                        ) : (
                                            <span className="text-gray-500">メンバー情報がありません</span>
                                        )} ({member.role})
                                    </li>
                                ))
                            ) : (
                                <p className="text-gray-500">メンバーがいません。</p>
                            )}
                        </ul>

                        <h3 className="text-lg font-semibold mt-6">関連プロジェクト</h3>
                        <ul className="mt-4">
                            {team.projects.length > 0 ? (
                                team.projects.map(project => (
                                    <li key={project.id} className="py-2">
                                        <Link href={route('projects.show', project.id)} className="text-blue-500 hover:underline">
                                            {project.project_name}
                                        </Link>
                                        <span className="text-gray-600">{project.likes_count ?? 0} いいね</span>
                                    </li>
                                ))
                            ) : (
                                <p className="text-gray-500">関連するプロジェクトがありません。</p>
                            )}
                        </ul>

                        {/* ✅ リーダーのみ編集・削除ボタンを表示 */}
                        {isLeader && (
                            <div className="mt-6 space-x-2">
                                <Link
                                    href={route('teams.edit', team.id)}
                                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                >
                                    チーム編集
                                </Link>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                    disabled={processing}
                                >
                                    チーム削除
                                </button>
                            </div>
                        )}

                        {/* ✅ マイページへ戻るボタン */}
                        <div className="mt-6">
                            <Link href={route('mypage')} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                                マイページへ
                            </Link>
                        </div>

                        {/* ✅ ホームへ戻るボタン */}
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
            <Head title={team.team_name} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-semibold">チームメンバー</h3>
                        <ul className="mt-4">
                            {team.members.length > 0 ? (
                                team.members.map(member => (
                                    <li key={member.id} className="py-2">
                                        {member.user ? (
                                            <Link href={route('users.show', member.user.id)} className="text-blue-500 hover:underline">
                                                {member.user.name}
                                            </Link>
                                        ) : (
                                            <span className="text-gray-500">メンバー情報がありません</span>
                                        )} ({member.role})
                                    </li>
                                ))
                            ) : (
                                <p className="text-gray-500">メンバーがいません。</p>
                            )}
                        </ul>

                        <h3 className="text-lg font-semibold mt-6">関連プロジェクト</h3>
                        <ul className="mt-4">
                            {team.projects.length > 0 ? (
                                team.projects.map(project => (
                                    <li key={project.id} className="py-2">
                                        <Link href={route('projects.show', project.id)} className="text-blue-500 hover:underline">
                                            {project.project_name}
                                        </Link>
                                        <span className="text-gray-600">{project.likes_count ?? 0} いいね</span>
                                    </li>
                                ))
                            ) : (
                                <p className="text-gray-500">関連するプロジェクトがありません。</p>
                            )}
                        </ul>

                        {/* ✅ ホームへ戻るボタン */}
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
