import { Link } from '@inertiajs/react';
import SearchBar from '@/Pages/SearchBar'; // パスは環境に応じて調整

export default function GuestHeader({
    searchQuery,
    setSearchQuery,
    searchCategory,
    setSearchCategory
}) {
    return (
        <nav className="bg-[#55CFFF] border-b border-gray-100 fixed top-0 left-0 right-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* ✅ 左側：アプリ名 */}
                    <div className="text-lg font-semibold text-black">
                        <Link href="/" className="hover:underline">
                            HackFlow -博路-
                        </Link>
                    </div>

                    {/* ✅ 中央：検索バー */}
                    <div className="flex-1 flex items-center justify-center h-16">
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

                    {/* ✅ 右側：ログイン・新規登録 */}
                    <div className="flex flex-wrap justify-end items-center space-x-2">
                        <Link
                            href={route('statistics')}
                            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded transition"
                        >
                            統計
                        </Link>
                        <Link
                            href={route('login')}
                            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded transition"
                        >
                            ログイン
                        </Link>
                        <Link
                            href={route('register')}
                            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded transition"
                        >
                            新規登録
                        </Link>
                    </div>

                </div>
            </div>
        </nav>
    );
}
