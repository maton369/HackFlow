import { Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import UserDropdown from './UserDropdown';

export default function Header({ user }) {
    return (
        <nav className="bg-[#55CFFF] border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* ✅ 左側：ロゴ */}
                    <Link href="/" className="flex-shrink-0">
                        <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                    </Link>

                    {/* ✅ 中央：アプリ名（中央揃え） */}
                    <div className="flex-grow text-center">
                        <Link href="/" className="text-lg font-semibold text-black hover:underline">
                            HackFlow -博路-
                        </Link>
                    </div>

                    {/* ✅ 右側：ユーザーメニュー */}
                    <div className="flex-shrink-0">
                        <UserDropdown user={user} />
                    </div>
                </div>
            </div>
        </nav>
    );
}
