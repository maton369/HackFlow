import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, user }) {
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

                        <div className="mt-4">
                            <p><strong>名前:</strong> {user.name}</p>
                            <p><strong>メールアドレス:</strong> {user.email}</p>
                            <p><strong>登録日:</strong> {user.created_at}</p>
                        </div>

                        <div className="mt-6 space-y-2">
                            <Link href={route('home')} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">ホームへ戻る</Link>
                            <Link href={route('mypage')} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">マイページ</Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
