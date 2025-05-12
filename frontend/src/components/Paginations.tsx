import Link from "next/link";

export type PaginationProps = {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const handlePageClick = (page: number) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let page = start; page <= end; page++) {
      pages.push(
        <li
          key={page}
          className={`page-item ${page === currentPage ? "active" : ""}`}
        >
          <button
            className="page-link rounded-pill text-primary border-0"
            onClick={() => handlePageClick(page)}
            style={{
              backgroundColor: page === currentPage ? "#4A8BDF" : "transparent",
              color: page === currentPage ? "#FFFFFF" : "#4A8BDF",
            }}
          >
            {page}
          </button>
        </li>
      );
    }

    return pages;
  };

  return (
    <nav>
      <ul className="pagination justify-content-center">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            className="page-link rounded-pill text-primary border-0"
            onClick={() => handlePageClick(currentPage - 1)}
          >
            Previous
          </button>
        </li>
        {renderPageNumbers()}
        <li
          className={`page-item ${
            currentPage === totalPages ? "disabled" : ""
          }`}
        >
          <button
            className="page-link rounded-pill text-primary border-0"
            onClick={() => handlePageClick(currentPage + 1)}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
}
