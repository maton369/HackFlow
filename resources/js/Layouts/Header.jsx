import { Link } from '@inertiajs/react';
import UserDropdown from './UserDropdown';
import SearchBar from '@/Pages/SearchBar'; // パスに注意！

export default function Header({ user,
    searchQuery,
    setSearchQuery,
    searchCategory,
    setSearchCategory }) {
    return (
        <nav className="bg-[#55CFFF] border-b border-gray-100 fixed top-0 left-0 right-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center h-16">
                    {/* 左：アプリ名 */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-lg font-semibold text-black hover:underline">
                            HackFlow -博路-
                        </Link>
                    </div>

                    {/* 中央：検索バー（中央揃え） */}
                    <div className="flex-1 flex justify-center items-center px-4">
                        <div className="w-full max-w-md">
                            <SearchBar
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                                searchCategory={searchCategory}
                                setSearchCategory={setSearchCategory}
                                inHeader={true}
                            />
                        </div>
                    </div>

                    {/* 右：ユーザーメニュー */}
                    <div className="flex items-center space-x-4">
                        <Link
                            href={route('statistics')}
                            className="bg-yellow-300 hover:bg-yellow-400 text-black font-semibold px-4 py-1 rounded transition"
                        >
                            統計
                        </Link>
                        <UserDropdown user={user} />
                    </div>

                </div>
            </div>
        </nav>
    );
}
