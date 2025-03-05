import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home({ auth, projects, teams }) {
    const isAuthenticated = auth.user !== null;

    // プロジェクトごとのいいね状態といいね数を管理
    const [likes, setLikes] = useState({});
    const [likeCounts, setLikeCounts] = useState(() => {
        return projects.reduce((acc, project) => {
            acc[project.id] = project.like_count; // 初期値にサーバーからの `like_count`
            return acc;
        }, {});
    });

    useEffect(() => {
        // ✅ いいね数をAPIから最新のデータに更新
        const fetchLikeCounts = async () => {
            const countsData = { ...likeCounts };
            await Promise.all(
                projects.map(async (project) => {
                    try {
                        const response = await axios.get(`/projects/${project.id}/like-count`);
                        countsData[project.id] = response.data.count;
                    } catch (error) {
                        console.error(`Failed to fetch like count for project ${project.id}`, error);
                    }
                })
            );
            setLikeCounts(countsData); // 更新データをセット
        };

        fetchLikeCounts();

        // ✅ いいね状態はログインしている場合のみ取得
        if (isAuthenticated) {
            const fetchLikes = async () => {
                const likesData = {};
                for (const project of projects) {
                    try {
                        const response = await axios.get(`/projects/${project.id}/is-liked`);
                        likesData[project.id] = response.data.liked;
                    } catch (error) {
                        console.error(`Failed to fetch like status for project ${project.id}`, error);
                    }
                }
                setLikes(likesData);
            };

            fetchLikes();
        }
    }, [projects, isAuthenticated]);

    const toggleLike = async (projectId) => {
        if (!isAuthenticated) {
            alert("ログインが必要です");
            return;
        }

        try {
            const response = await axios.post(`/projects/${projectId}/like`);
            setLikes((prevLikes) => ({
                ...prevLikes,
                [projectId]: response.data.liked
            }));

            // ✅ いいね数を更新
            setLikeCounts((prevCounts) => ({
                ...prevCounts,
                [projectId]: response.data.liked ? prevCounts[projectId] + 1 : prevCounts[projectId] - 1
            }));
        } catch (error) {
            console.error(`Failed to toggle like for project ${projectId}`, error);
        }
    };

    return (
        <>
            {isAuthenticated ? (
                <AuthenticatedLayout
                    user={auth.user}
                    header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Home</h2>}
                >
                    <Head title="Home" />
                    <div className="py-12">
                        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                                <p className="text-gray-900">Welcome to HackFlow, {auth.user.name}!</p>

                                {/* ✅ プロジェクト一覧 */}
                                <h3 className="mt-6 text-lg font-semibold">プロジェクト一覧</h3>
                                <ul className="mt-4">
                                    {projects.map(project => (
                                        <li key={project.id} className="py-2 flex items-center justify-between">
                                            <Link href={route('projects.show', project.id)} className="text-blue-500 hover:underline">
                                                {project.project_name}
                                            </Link>
                                            <div className="flex items-center">
                                                {/* ✅ いいね数を表示（データ取得後のみ） */}
                                                {likeCounts && likeCounts[project.id] !== undefined && (
                                                    <span className="text-gray-600 mr-2">{likeCounts[project.id]} いいね</span>
                                                )}                                                {isAuthenticated && (
                                                    <button
                                                        onClick={() => toggleLike(project.id)}
                                                        className={`ml-4 px-3 py-1 text-white rounded ${likes[project.id] ? 'bg-red-500' : 'bg-gray-500'}`}
                                                    >
                                                        {likes[project.id] ? '❤️ いいね解除' : '🤍 いいね'}
                                                    </button>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                {/* ✅ チーム一覧 */}
                                <h3 className="mt-6 text-lg font-semibold">チーム一覧</h3>
                                <ul className="mt-4">
                                    {teams.map(team => (
                                        <li key={team.id} className="py-2">
                                            <Link href={route('teams.show', team.id)} className="text-blue-500 hover:underline">
                                                {team.team_name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>

                                {/* ✅ マイページ & 統計画面へのリンク */}
                                <div className="mt-6 flex space-x-4">
                                    <Link href={route('mypage')} className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600">
                                        マイページへ
                                    </Link>
                                    <Link href={route('statistics')} className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
                                        統計画面へ
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </AuthenticatedLayout>
            ) : (
                <GuestLayout>
                    <Head title="Home" />
                    <div className="py-12">
                        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                                <p className="text-gray-900">Welcome to HackFlow! ログインするとより多くの機能が使えます。</p>

                                {/* ✅ プロジェクト一覧 */}
                                <h3 className="mt-6 text-lg font-semibold">プロジェクト一覧</h3>
                                <ul className="mt-4">
                                    {projects.map(project => (
                                        <li key={project.id} className="py-2 flex items-center justify-between">
                                            <Link href={route('projects.show', project.id)} className="text-blue-500 hover:underline">
                                                {project.project_name}
                                            </Link>
                                            <div className="flex items-center">
                                                {/* ✅ いいね数を表示（データ取得後のみ） */}
                                                {likeCounts && likeCounts[project.id] !== undefined && (
                                                    <span className="text-gray-600 mr-2">{likeCounts[project.id]} いいね</span>
                                                )}                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                {/* ✅ チーム一覧 */}
                                <h3 className="mt-6 text-lg font-semibold">チーム一覧</h3>
                                <ul className="mt-4">
                                    {teams.map(team => (
                                        <li key={team.id} className="py-2">
                                            <Link href={route('teams.show', team.id)} className="text-blue-500 hover:underline">
                                                {team.team_name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>

                                {/* ✅ 未ログイン時のボタン */}
                                <div className="mt-6 space-y-2">
                                    <Link href={route('login')} className="block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                        ログイン
                                    </Link>
                                    <Link href={route('register')} className="block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                                        新規登録
                                    </Link>
                                </div>

                                <div className="mt-6 flex space-x-4">
                                    <Link href={route('statistics')} className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
                                        統計画面へ
                                    </Link>
                                </div>

                            </div>
                        </div>
                    </div>
                </GuestLayout>
            )}
        </>
    );
}
