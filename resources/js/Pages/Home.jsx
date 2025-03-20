import { useState, useEffect } from "react";
import axios from "axios";
import AuthenticatedLayout from "../Layouts/AuthenticatedLayout";
import GuestLayout from "../Layouts/GuestLayout";
import { Head } from "@inertiajs/react";
import SearchBar from "./SearchBar";
import ProjectList from "./ProjectList";
import NavigationLinks from "./NavigationLinks";

export default function Home({ auth, projects, userLikes = [] }) {
    const isAuthenticated = auth.user !== null;

    // ✅ いいね機能の `useState`
    const [likes, setLikes] = useState(() =>
        projects.reduce((acc, project) => {
            acc[project.id] = userLikes?.includes(project.id) ?? false;
            return acc;
        }, {})
    );

    const [likeCounts, setLikeCounts] = useState(() =>
        projects.reduce((acc, project) => {
            acc[project.id] = project.likes_count ?? 0;
            return acc;
        }, {})
    );

    const toggleLike = async (projectId) => {
        if (!isAuthenticated) {
            alert("ログインが必要です");
            return;
        }

        console.log(`👍 いいねボタンが押されました！(ID: ${projectId})`);

        setLikes((prevLikes) => {
            const newLikedState = !prevLikes[projectId];

            console.log(`🔄 UI更新: 変更前=${prevLikes[projectId]}, 変更後=${newLikedState}`);

            setLikeCounts((prevCounts) => ({
                ...prevCounts,
                [projectId]: newLikedState ? prevCounts[projectId] + 1 : Math.max(prevCounts[projectId] - 1, 0),
            }));

            return { ...prevLikes, [projectId]: newLikedState };
        });

        try {
            console.log(`📡 APIリクエスト開始: /projects/${projectId}/like`);
            const response = await axios.post(`/projects/${projectId}/like`);
            console.log(`✅ APIレスポンス:`, response.data);

            const liked = response.data.liked;

            // ✅ APIの結果に基づいて最終的ないいね状態を更新
            setLikes((prevLikes) => ({
                ...prevLikes,
                [projectId]: liked,
            }));

            setLikeCounts((prevCounts) => ({
                ...prevCounts,
                [projectId]: liked ? prevCounts[projectId] : Math.max(prevCounts[projectId], 0),
            }));

            console.log(`🎉 いいね処理完了！(ID: ${projectId}, liked=${liked})`);
        } catch (error) {
            console.error("❌ いいね処理中にエラー発生:", error);

            // ✅ エラー時には元の状態に戻す
            setLikes((prevLikes) => {
                const rollbackLikedState = !prevLikes[projectId];
                console.log(`🛑 エラー発生時の likes 巻き戻し: ${rollbackLikedState}`);

                setLikeCounts((prevCounts) => ({
                    ...prevCounts,
                    [projectId]: rollbackLikedState ? prevCounts[projectId] + 1 : Math.max(prevCounts[projectId] - 1, 0),
                }));

                return { ...prevLikes, [projectId]: rollbackLikedState };
            });
        }
    };

    // ✅ テストアカウントでログイン
    const handleTestLogin = async () => {
        try {
            await axios.post("/login", {
                email: "leader@example.com",
                password: "password",
            });

            // ✅ ログイン成功後にリロード
            window.location.reload();
        } catch (error) {
            alert("ログインに失敗しました");
        }
    };

    return (
        <>
            {isAuthenticated ? (
                <AuthenticatedLayout user={auth.user}>
                    <Head title="Home" />
                    <SearchBar
                        searchQuery=""
                        setSearchQuery={() => { }}
                        searchCategory="projects"
                        setSearchCategory={() => { }}
                    />
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-12">
                        <h3 className="text-lg font-semibold">プロジェクト一覧</h3>
                        <ProjectList
                            projects={projects}
                            likes={likes}
                            likeCounts={likeCounts}
                            toggleLike={toggleLike}
                        />
                        <NavigationLinks isAuthenticated={isAuthenticated} />
                    </div>
                </AuthenticatedLayout>
            ) : (
                <GuestLayout>
                    <Head title="Home" />
                    <SearchBar
                        searchQuery=""
                        setSearchQuery={() => { }}
                        searchCategory="projects"
                        setSearchCategory={() => { }}
                    />
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-12">
                        <h3 className="text-lg font-semibold">プロジェクト一覧</h3>
                        <ProjectList
                            projects={projects}
                            likes={likes}
                            likeCounts={likeCounts}
                            toggleLike={toggleLike}
                        />
                        <NavigationLinks isAuthenticated={isAuthenticated} />

                        {/* ✅ テストアカウントログインボタン */}
                        <div className="mt-6 flex justify-center">
                            <button
                                onClick={handleTestLogin}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                            >
                                テストアカウントでログイン
                            </button>
                        </div>
                    </div>
                </GuestLayout>
            )}
        </>
    );
}
