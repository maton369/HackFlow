import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, team }) {
    return (
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
                            {team.members.map(member => (
                                <li key={member.id} className="py-2">
                                    <Link href={route('users.show', member.user.id)} className="text-blue-500 hover:underline">
                                        {member.user.name}
                                    </Link> ({member.role})
                                </li>
                            ))}
                        </ul>

                        <h3 className="text-lg font-semibold mt-6">関連プロジェクト</h3>
                        <ul className="mt-4">
                            {team.projects.map(project => (
                                <li key={project.id} className="py-2">
                                    <Link href={route('projects.show', project.id)} className="text-blue-500 hover:underline">
                                        {project.project_name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
