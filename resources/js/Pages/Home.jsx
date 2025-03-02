import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout'; // ゲスト用のレイアウト（未ログインユーザー向け）
import { Head, Link } from '@inertiajs/react';

export default function Home({ auth }) {
    const isAuthenticated = auth.user !== null; // ユーザーがログインしているか判定

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

                                <div className="mt-4 space-y-2">
                                    <Link href={route('mypage')} className="block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">マイページ</Link>
                                    <Link href={route('projects.create')} className="block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">プロジェクト作成</Link>
                                    <Link href={route('teams.create')} className="block px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">チーム作成</Link>
                                    <Link href={route('statistics')} className="block px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">統計ページ</Link>
                                </div>
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
                                    <Link href={route('login')} className="block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">ログイン</Link>
                                    <Link href={route('register')} className="block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">新規登録</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </GuestLayout>
            )}
        </>
    );
}
