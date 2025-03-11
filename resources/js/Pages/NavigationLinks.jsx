import { Link } from '@inertiajs/react';

export default function NavigationLinks({ isAuthenticated }) {
    return (
        <div className="mt-6 flex space-x-4">
            {isAuthenticated ? (
                <>
                    <Link href={route('mypage')} className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600">
                        マイページへ
                    </Link>
                </>
            ) : (
                <>
                    <Link href={route('login')} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        ログイン
                    </Link>
                    <Link href={route('register')} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                        新規登録
                    </Link>
                </>
            )}
            <Link href={route('statistics')} className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
                統計画面へ
            </Link>
        </div>
    );
}
