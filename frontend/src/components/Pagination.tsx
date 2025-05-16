"use client";

import { Pagination } from "react-bootstrap";

interface PaginationControlsProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const PaginationControls = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}: PaginationControlsProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);

    const pages = [1];

    if (currentPage > 3) pages.push("ellipsis-start");

    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      if (i > 1 && i < totalPages) pages.push(i);
    }

    if (currentPage < totalPages - 2) pages.push("ellipsis-end");

    pages.push(totalPages);

    return pages;
  };

  return (
    <Pagination className="mt-3 justify-content-center gap-2">
      <Pagination.Prev
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      />
      {getVisiblePages().map((page, idx) => {
        if (page === "ellipsis-start" || page === "ellipsis-end") {
          return <Pagination.Ellipsis key={idx} disabled />;
        }

        return (
          <Pagination.Item
            key={page}
            active={page === currentPage}
            onClick={() => onPageChange(Number(page))}
            style={{ opacity: page === currentPage ? 1 : 0.7 }}
          >
            {page}
          </Pagination.Item>
        );
      })}
      <Pagination.Next
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      />
    </Pagination>
  );
};

export default PaginationControls;
