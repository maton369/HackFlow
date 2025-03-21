import Header from './Header';
import Footer from '@/Pages/Components/Footer';

export default function Authenticated({ user,
    header,
    searchQuery,
    setSearchQuery,
    searchCategory,
    setSearchCategory,
    children, }) {
    return (
        <div className="min-h-screen bg-[#28A745] flex flex-col pt-16">
            <Header user={user}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchCategory={searchCategory}
                setSearchCategory={setSearchCategory} />

            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            {/* ✅ メインコンテンツ */}
            <main className="flex-grow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 bg-gray-100 rounded shadow">
                    {children}
                </div>
            </main>


            {/* ✅ フッター */}
            <Footer />
        </div>
    );
}
