import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';

export default function AppDescription({ auth }) {
    return auth.user ? (
        <AuthenticatedLayout user={auth.user}>
            <Head title="アプリの説明" />
            <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded">
                <h1 className="text-2xl font-bold mb-4">HackFlow とは？</h1>
                <p className="text-gray-700">
                    HackFlow は、開発プロジェクトを管理し、開発者同士がコラボレーションできるプラットフォームです。
                    プロジェクトに「いいね」したり、チームを作成して共同作業を行うことができます。
                </p>
                <p className="text-gray-700 mt-4">
                    - プロジェクトの検索と管理
                    - チームの作成と参加
                    - ユーザーの検索とフォロー
                </p>

                {/* ✅ ログイン時のナビゲーション */}
                <div className="mt-6 flex space-x-4">
                    <Link href="/" className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                        ホームへ戻る
                    </Link>
                    <Link href="/mypage" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        マイページへ
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    ) : (
        <GuestLayout>
            <Head title="アプリの説明" />
            <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded">
                <h1 className="text-2xl font-bold mb-4">HackFlow とは？</h1>
                <p className="text-gray-700">
                    HackFlow は、開発プロジェクトを管理し、開発者同士がコラボレーションできるプラットフォームです。
                    プロジェクトに「いいね」したり、チームを作成して共同作業を行うことができます。
                </p>
                <p className="text-gray-700 mt-4">
                    - プロジェクトの検索と管理
                    - チームの作成と参加
                    - ユーザーの検索とフォロー
                </p>

                {/* ✅ ゲスト時のナビゲーション */}
                <div className="mt-6 flex space-x-4">
                    <Link href="/" className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                        ホームへ戻る
                    </Link>
                    <Link href="/register" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                        新規登録
                    </Link>
                </div>
            </div>
        </GuestLayout>
    );
}
