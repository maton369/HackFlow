import { useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';

Chart.register(ArcElement, Tooltip, Legend);

export default function Statistics({ techStackCounts = [] }) {
    const { auth } = usePage().props;

    useEffect(() => {
        console.log("📊 技術スタック統計データ:", techStackCounts);
    }, [techStackCounts]);

    const data = {
        labels: techStackCounts.map(item => item.tech_stack?.name || "不明"),
        datasets: [
            {
                label: '使用されている技術スタック',
                data: techStackCounts.map(item => item.usage_count),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)', 'rgba(201, 203, 207, 0.6)', 'rgba(0, 128, 128, 0.6)',
                    'rgba(255, 105, 180, 0.6)', 'rgba(100, 149, 237, 0.6)', 'rgba(210, 105, 30, 0.6)', 'rgba(60, 179, 113, 0.6)',
                    'rgba(255, 69, 0, 0.6)', 'rgba(123, 104, 238, 0.6)', 'rgba(0, 191, 255, 0.6)', 'rgba(154, 205, 50, 0.6)',
                    'rgba(255, 20, 147, 0.6)', 'rgba(32, 178, 170, 0.6)', 'rgba(72, 61, 139, 0.6)', 'rgba(124, 252, 0, 0.6)',
                    'rgba(0, 255, 127, 0.6)', 'rgba(255, 215, 0, 0.6)', 'rgba(173, 255, 47, 0.6)', 'rgba(30, 144, 255, 0.6)',
                    'rgba(255, 160, 122, 0.6)', 'rgba(147, 112, 219, 0.6)', 'rgba(0, 250, 154, 0.6)', 'rgba(250, 128, 114, 0.6)',
                    'rgba(244, 164, 96, 0.6)', 'rgba(46, 139, 87, 0.6)', 'rgba(255, 228, 181, 0.6)', 'rgba(176, 224, 230, 0.6)',
                    'rgba(95, 158, 160, 0.6)', 'rgba(152, 251, 152, 0.6)', 'rgba(106, 90, 205, 0.6)', 'rgba(240, 230, 140, 0.6)',
                    'rgba(238, 130, 238, 0.6)', 'rgba(189, 183, 107, 0.6)', 'rgba(173, 216, 230, 0.6)', 'rgba(244, 164, 96, 0.6)',
                    'rgba(255, 182, 193, 0.6)', 'rgba(255, 218, 185, 0.6)', 'rgba(221, 160, 221, 0.6)', 'rgba(176, 196, 222, 0.6)',
                    'rgba(255, 250, 205, 0.6)', 'rgba(210, 180, 140, 0.6)', 'rgba(144, 238, 144, 0.6)', 'rgba(255, 222, 173, 0.6)',
                    'rgba(255, 105, 97, 0.6)', 'rgba(216, 191, 216, 0.6)', 'rgba(240, 128, 128, 0.6)', 'rgba(175, 238, 238, 0.6)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)', 'rgba(201, 203, 207, 1)', 'rgba(0, 128, 128, 1)',
                    'rgba(255, 105, 180, 1)', 'rgba(100, 149, 237, 1)', 'rgba(210, 105, 30, 1)', 'rgba(60, 179, 113, 1)',
                    'rgba(255, 69, 0, 1)', 'rgba(123, 104, 238, 1)', 'rgba(0, 191, 255, 1)', 'rgba(154, 205, 50, 1)',
                    'rgba(255, 20, 147, 1)', 'rgba(32, 178, 170, 1)', 'rgba(72, 61, 139, 1)', 'rgba(124, 252, 0, 1)',
                    'rgba(0, 255, 127, 1)', 'rgba(255, 215, 0, 1)', 'rgba(173, 255, 47, 1)', 'rgba(30, 144, 255, 1)',
                    'rgba(255, 160, 122, 1)', 'rgba(147, 112, 219, 1)', 'rgba(0, 250, 154, 1)', 'rgba(250, 128, 114, 1)',
                    'rgba(244, 164, 96, 1)', 'rgba(46, 139, 87, 1)', 'rgba(255, 228, 181, 1)', 'rgba(176, 224, 230, 1)',
                    'rgba(95, 158, 160, 1)', 'rgba(152, 251, 152, 1)', 'rgba(106, 90, 205, 1)', 'rgba(240, 230, 140, 1)',
                    'rgba(238, 130, 238, 1)', 'rgba(189, 183, 107, 1)', 'rgba(173, 216, 230, 1)', 'rgba(244, 164, 96, 1)',
                    'rgba(255, 182, 193, 1)', 'rgba(255, 218, 185, 1)', 'rgba(221, 160, 221, 1)', 'rgba(176, 196, 222, 1)',
                    'rgba(255, 250, 205, 1)', 'rgba(210, 180, 140, 1)', 'rgba(144, 238, 144, 1)', 'rgba(255, 222, 173, 1)',
                    'rgba(255, 105, 97, 1)', 'rgba(216, 191, 216, 1)', 'rgba(240, 128, 128, 1)', 'rgba(175, 238, 238, 1)'
                ],
                borderWidth: 1,
            },
        ],
    };

    const Layout = auth?.user ? AuthenticatedLayout : GuestLayout;

    return (
        <Layout
            {...(auth?.user && {
                user: auth.user,
                header: (
                    <h2 className="font-semibold text-xl text-white leading-tight bg-[#28A745] py-4 px-6 rounded-t-lg">
                        Tech Trends - 技術動向
                    </h2>
                ),
            })}
        >
            <Head title="Tech Trends" />

            {/* ✅ 背景色を緑に変更 */}
            <div className="py-12 bg-[#28A745] min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-semibold">プロジェクトの技術スタック動向</h3>

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
                            {auth?.user && (
                                <Link href={route('mypage')} className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
                                    マイページへ戻る
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
