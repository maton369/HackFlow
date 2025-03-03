import { useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

export default function Statistics({ auth, techStackCounts = [] }) {
    useEffect(() => {
        console.log("📊 技術スタック統計データ:", techStackCounts);
    }, [techStackCounts]);

    const data = {
        labels: techStackCounts.map(item => item.tech_stack?.name || "不明"),
        datasets: [
            {
                label: '使用されている技術スタック',
                data: techStackCounts.map(item => item.usage_count), // ✅ `usage_count` を使用
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">統計ページ</h2>}
        >
            <Head title="Statistics" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-semibold">プロジェクトの技術スタック統計</h3>

                        {techStackCounts.length > 0 ? (
                            <div className="mt-6">
                                <Pie data={data} />
                            </div>
                        ) : (
                            <p className="mt-4 text-gray-600">データがありません。</p>
                        )}

                        <div className="mt-4 space-x-2">
                            <Link href={route('home')} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                ホームに戻る
                            </Link>
                            <Link href={route('mypage')} className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
                                マイページへ戻る
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
