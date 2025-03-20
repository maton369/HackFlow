import { Link } from "@inertiajs/react";

export default function ProjectCard({ project, isLiked, likeCount, onToggleLike }) {
    return (
        <div className="w-full md:w-1/2 lg:w-1/4 p-2">
            <Link
                href={route("projects.show", project.id)}
                className="block relative bg-gray-200 rounded-lg shadow-lg hover:shadow-xl transform hover:translate-y-[-5px] transition-all duration-300 overflow-hidden"
            >
                <img
                    src={project.project_image_url || "/default-project.png"}
                    alt={project.project_name}
                    className="w-full h-32 object-cover"
                />
                <div className="p-4">
                    <h3 className="text-lg font-semibold">
                        <span
                            className="text-blue-500 hover:underline"
                            onClick={(e) => e.stopPropagation()} // 親のクリックイベントを防ぐ
                        >
                            {project.project_name}
                        </span>
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        チーム: {project.team ? project.team.team_name : "チームなし"}
                    </p>

                    {/* ✅ 技術スタックの表示 */}
                    <div className="mt-2">
                        <h4 className="text-sm font-semibold">技術スタック:</h4>
                        {project.tech_stacks && project.tech_stacks.length > 0 ? (
                            <ul className="list-disc pl-4 text-sm text-gray-700">
                                {project.tech_stacks.map((stack) => (
                                    <li key={stack.id}>{stack.name}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500">なし</p>
                        )}
                    </div>

                    {/* ✅ タグの表示 */}
                    <div className="mt-2">
                        <h4 className="text-sm font-semibold">タグ:</h4>
                        {project.tags && project.tags.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                                {project.tags.map((tag) => (
                                    <span
                                        key={tag.id}
                                        className="px-2 py-1 text-xs bg-gray-300 text-gray-700 rounded"
                                    >
                                        {tag.name}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">なし</p>
                        )}
                    </div>
                </div>

                {/* ✅ いいねボタン（右下に配置） */}
                <div className="absolute bottom-2 right-2 flex items-center">
                    <button
                        onClick={(e) => {
                            e.preventDefault(); // `Link` のクリックを防ぐ
                            onToggleLike(project.id);
                        }}
                        className={`transition-all duration-300 transform ${isLiked ? "text-pink-500 scale-110" : "text-gray-500"}`}
                    >
                        {isLiked ? "❤️" : "🤍"}
                    </button>
                    <span className="ml-1 text-gray-600 text-sm">{likeCount}</span>
                </div>
            </Link>
        </div>
    );
}
