import ProjectCard from './ProjectCard';

export default function ProjectList({ projects, likes, likeCounts, toggleLike }) {
    return (
        <div className="flex flex-wrap -m-2">
            {projects.slice(0, 8).map(project => (
                <ProjectCard
                    key={project.id}
                    project={project}
                    isLiked={likes[project.id] ?? false}
                    likeCount={likeCounts[project.id] ?? 0}
                    onToggleLike={toggleLike}
                />
            ))}
            {projects.length > 8 && (
                <div className="w-full text-center mt-4">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        もっと見る
                    </button>
                </div>
            )}
        </div>
    );
}
