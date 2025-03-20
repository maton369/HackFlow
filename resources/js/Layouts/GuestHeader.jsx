import { Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function GuestHeader() {
    return (
        <nav className="bg-[#55CFFF] border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* ✅ 左側：ロゴ */}
                    <Link href="/">
                        <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                    </Link>

                    {/* ✅ 中央：アプリ名 */}
                    <div className="hidden sm:flex text-lg font-semibold text-black">
                        <Link href="/" className="hover:underline">
                            HackFlow -博路-
                        </Link>
                    </div>

                    {/* ✅ 右側：ログイン・新規登録 */}
                    <div className="hidden sm:flex space-x-4">
                        <Link href={route('login')} className="text-gray-700 hover:text-gray-900">
                            ログイン
                        </Link>
                        <Link href={route('register')} className="text-gray-700 hover:text-gray-900">
                            新規登録
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
