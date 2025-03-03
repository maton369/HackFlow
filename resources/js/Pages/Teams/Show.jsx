import { useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, team }) {
    useEffect(() => {
        console.log("✅ チームデータ:", team);
        console.log("✅ チームメンバー:", team.members);
        console.log("✅ 認証ユーザー:", auth.user);
    }, [team, auth]);

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
                                        <Link href={route('users.show', member.user.id)} className="text-blue-500 hover:underline">
                                            {member.user.name}
                                        </Link> ({member.role})
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
                                    </li>
                                ))
                            ) : (
                                <p className="text-gray-500">関連するプロジェクトがありません。</p>
                            )}
                        </ul>

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
                                        <Link href={route('users.show', member.user.id)} className="text-blue-500 hover:underline">
                                            {member.user.name}
                                        </Link> ({member.role})
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

                        <div className="mt-6">
                            <Link href={route('login')} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                ログイン
                            </Link>
                            <Link href={route('register')} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ml-2">
                                新規登録
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
