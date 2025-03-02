import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link } from '@inertiajs/react';

export default function Create({ auth }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="チーム作成" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h2 className="text-lg font-bold mb-4">新しいチームを作成</h2>

                        <p className="text-gray-700 mb-6">
                            チームを作成するには、下の「戻る」ボタンで前のページに戻ってください。
                        </p>

                        <div className="mt-4">
                            <Link href={route('home')}>
                                <PrimaryButton>戻る</PrimaryButton>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
