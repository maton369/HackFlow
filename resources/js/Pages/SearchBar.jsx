export default function SearchBar({ searchQuery, setSearchQuery }) {
    return (
        <div className="max-w-7xl mx-auto mt-6 px-4">
            <input
                type="text"
                placeholder="タグで検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
            />
        </div>
    );
}
