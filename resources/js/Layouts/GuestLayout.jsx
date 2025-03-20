import GuestHeader from './GuestHeader';
import Footer from '@/Pages/Components/Footer';

export default function Guest({ children }) {
    return (
        <div className="min-h-screen bg-[#28A745] flex flex-col">
            <GuestHeader />

            {/* ✅ コンテンツ部分（AuthenticatedLayout に合わせて統一） */}
            <main className="flex-grow">
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</div>
            </main>

            <Footer />
        </div>
    );
}
