export default function SubscriptionFilters({
  search,
  statusFilter,
  sortOrder,
  onSearchChange,
  onStatusChange,
  onSortToggle,
}: {
  search: string;
  statusFilter: string;
  sortOrder: "asc" | "desc";
  onSearchChange: (val: string) => void;
  onStatusChange: (val: string) => void;
  onSortToggle: () => void;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:flex-row sm:items-center sm:justify-between">
      {/* Search Input */}
      <div className="relative w-full sm:max-w-xs">
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search subscriber, plan..."
          className="w-full rounded-xl border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:text-white"
        />
      </div>

      {/* Filters & Sort */}
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="grow rounded-xl border border-gray-300 bg-transparent px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:grow-0"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button
          type="button"
          onClick={onSortToggle}
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          Sort: {sortOrder === "desc" ? "Newest" : "Oldest"}
        </button>
      </div>
    </div>
  );
}