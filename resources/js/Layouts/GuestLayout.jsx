import GuestHeader from './GuestHeader';
import Footer from '@/Pages/Components/Footer';

export default function Guest({
    children,
    searchQuery,
    setSearchQuery,
    searchCategory,
    setSearchCategory,
}) {
    return (
        <div className="min-h-screen bg-[#28A745] flex flex-col pt-16">
            <GuestHeader
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchCategory={searchCategory}
                setSearchCategory={setSearchCategory}
            />

            <main className="flex-grow">
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 bg-gray-100 rounded shadow">
                    {children}
                </div>
            </main>


            <Footer />
        </div>
    );
}
