import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function CreateProject({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">プロジェクト作成</h2>}
        >
            <Head title="Create Project" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <p className="text-gray-900">プロジェクトを作成してください。</p>

                        <div className="mt-4">
                            <Link href={route('home')} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">ホームに戻る</Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
