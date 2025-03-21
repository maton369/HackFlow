export default function SearchBar({ searchQuery, setSearchQuery }) {
    return (
        <div className="w-full">
            <input
                type="text"
                placeholder="タグで検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 px-3 py-1 border border-gray-300 rounded-md text-sm"
            />
        </div>
    );
}
