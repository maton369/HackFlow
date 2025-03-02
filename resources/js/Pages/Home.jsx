import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';

export default function Home({ auth, projects, teams }) {
    const isAuthenticated = auth.user !== null;

    return (
        <>
            {isAuthenticated ? (
                <AuthenticatedLayout
                    user={auth.user}
                    header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Home</h2>}
                >
                    <Head title="Home" />
                    <div className="py-12">
                        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                                <p className="text-gray-900">Welcome to HackFlow, {auth.user.name}!</p>

                                <h3 className="mt-6 text-lg font-semibold">プロジェクト一覧</h3>
                                <ul className="mt-4">
                                    {projects.map(project => (
                                        <li key={project.id} className="py-2">
                                            <Link href={route('projects.show', project.id)} className="text-blue-500 hover:underline">
                                                {project.project_name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>

                                <h3 className="mt-6 text-lg font-semibold">チーム一覧</h3>
                                <ul className="mt-4">
                                    {teams.map(team => (
                                        <li key={team.id} className="py-2">
                                            <Link href={route('teams.show', team.id)} className="text-blue-500 hover:underline">
                                                {team.team_name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </AuthenticatedLayout>
            ) : (
                <GuestLayout>
                    <Head title="Home" />
                    <div className="py-12">
                        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                                <p className="text-gray-900">Welcome to HackFlow! ログインするとより多くの機能が使えます。</p>
                                <div className="mt-4 space-y-2">
                                    <Link href={route('login')} className="block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                        ログイン
                                    </Link>
                                    <Link href={route('register')} className="block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                                        新規登録
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </GuestLayout>
            )}
        </>
    );
}
