import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function MyPage({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">マイページ</h2>}
        >
            <Head title="My Page" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <p className="text-gray-900">こんにちは、{auth.user.name} さん！</p>

                        <div className="mt-4 space-y-2">
                            <Link href={route('projects.create')} className="block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">プロジェクト作成</Link>
                            <Link href={route('teams.create')} className="block px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">チーム作成</Link>
                            <Link href={route('statistics')} className="block px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">統計ページ</Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
