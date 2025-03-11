export default function SearchBar({ searchQuery, setSearchQuery, searchCategory, setSearchCategory }) {
    return (
        <div className="max-w-7xl mx-auto mt-6 px-4">
            <input
                type="text"
                placeholder="名前で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
            />
            <div className="mt-3 flex space-x-2">
                {["projects", "teams", "users"].map(category => (
                    <button
                        key={category}
                        className={`px-4 py-2 rounded ${searchCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                        onClick={() => setSearchCategory(category)}
                    >
                        {category === "projects" ? "プロジェクト" : category === "teams" ? "チーム" : "ユーザー"}
                    </button>
                ))}
            </div>
        </div>
    );
}
