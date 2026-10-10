
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";

interface Props {
  totalItems: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function SubscriptionPagination({
  totalItems,
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
}: Props) {
  if (totalItems === 0 || totalPages <= 0) return null;

  const firstItem = (currentPage - 1) * itemsPerPage + 1;
  const lastItem = Math.min(totalItems, currentPage * itemsPerPage);

  const pages: (number | "dots-left" | "dots-right")[] = [];

  if (totalPages <= 5) {
    for (let page = 1; page <= totalPages; page += 1) {
      pages.push(page);
    }
  } else {
    pages.push(1);

    if (currentPage > 3) {
      pages.push("dots-left");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let page = start; page <= end; page += 1) {
      pages.push(page);
    }

    if (currentPage < totalPages - 2) {
      pages.push("dots-right");
    }

    pages.push(totalPages);
  }

  const buttonBase =
    "inline-flex shrink-0 items-center justify-center rounded-xl border transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-40";

  const navigationButton =
    `${buttonBase} h-10 w-10 border-gray-200 bg-white text-gray-600 shadow-sm ` +
    "hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 " +
    "disabled:hover:border-gray-200 disabled:hover:bg-white " +
    "dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 " +
    "dark:hover:border-gray-600 dark:hover:bg-gray-700 " +
    "dark:disabled:hover:bg-gray-800";

  return (
    <footer className="mt-7 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">
      {/* Results summary */}
      <div className="flex min-w-0 items-center justify-center gap-3 sm:justify-start">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
          <span className="text-sm font-bold">
            {currentPage}
          </span>
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-800 dark:text-white">
            Showing{" "}
            <span className="tabular-nums">
              {firstItem}–{lastItem}
            </span>{" "}
            of{" "}
            <span className="tabular-nums">{totalItems}</span>
          </p>

          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            Subscriptions · Page {currentPage} of {totalPages}
          </p>
        </div>
      </div>

      {/* Pagination controls */}
      <nav
        aria-label="Subscription pagination"
        className="flex max-w-full items-center justify-center gap-1.5"
      >
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
          title="Previous page"
          className={navigationButton}
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>

        <div className="flex min-w-0 flex-wrap items-center justify-center gap-1">
          {pages.map((page, index) => {
            if (typeof page !== "number") {
              return (
                <span
                  key={`${page}-${index}`}
                  aria-hidden="true"
                  className="flex h-9 w-5 items-center justify-center text-gray-400 dark:text-gray-500"
                >
                  <EllipsisHorizontalIcon className="h-5 w-5" />
                </span>
              );
            }

            const isActive = currentPage === page;

            return (
              <button
                type="button"
                key={page}
                onClick={() => onPageChange(page)}
                aria-label={`Go to page ${page}`}
                aria-current={isActive ? "page" : undefined}
                className={
                  isActive
                    ? `${buttonBase} h-10 min-w-10 border-blue-600 bg-blue-600 px-3 text-sm font-bold text-white shadow-md shadow-blue-600/20 hover:border-blue-700 hover:bg-blue-700`
                    : `${buttonBase} h-10 min-w-10 border-transparent bg-transparent px-3 text-sm font-semibold text-gray-600 hover:border-gray-200 hover:bg-gray-50 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-700`
                }
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
          title="Next page"
          className={navigationButton}
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </nav>
    </footer>
  );
}
