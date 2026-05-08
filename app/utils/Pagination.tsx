"use client";

import React, { useMemo } from "react";

interface PaginationProps {
  totalRecords: number; // total items count (can be 1000+)
  pageSize: number; // items per page
  currentPage: number; // active page
  onPageChange: (page: number) => void;
}

// Chevron Left Icon
const ChevronLeftIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 12L6 8L10 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Chevron Right Icon
const ChevronRightIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 4L10 8L6 12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Pagination = React.memo<PaginationProps>(
  ({ totalRecords, pageSize, currentPage, onPageChange }) => {
    // Calculate total pages
    const totalPages = useMemo(
      () => Math.ceil(totalRecords / pageSize),
      [totalRecords, pageSize]
    );

    // Generate page numbers with ellipsis logic
    const getPageNumbers = useMemo(() => {
      if (totalPages <= 1) return totalPages === 1 ? [1] : [];

      const pages: (number | string)[] = [];

      // For small page counts (≤7), show all pages
      if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
        return pages;
      }

      // Always show first page
      pages.push(1);

      // Determine visible pages around current page
      // Strategy: Show 2-3 pages on each side of current, with ellipsis when needed
      
      if (currentPage <= 4) {
        // Show: 1 2 3 4 5 ... last
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Show: 1 ... [last-4, last-3, last-2, last-1] last
        pages.push("ellipsis");
        for (let i = totalPages - 4; i <= totalPages - 1; i++) {
          pages.push(i);
        }
        pages.push(totalPages);
      } else {
        // Show: 1 ... [current-1, current, current+1] ... last
        pages.push("ellipsis");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("ellipsis");
        pages.push(totalPages);
      }

      return pages;
    }, [totalPages, currentPage]);

    // Handle page change
    const handlePageChange = (page: number) => {
      if (page >= 1 && page <= totalPages && page !== currentPage) {
        onPageChange(page);
      }
    };

    // Don't render if no records at all
    if (totalRecords === 0 || totalPages < 1) {
      return null;
    }

    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;

    return (
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 md:gap-2.5 flex-wrap px-2 sm:px-4">
        {/* Back Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={isFirstPage}
          className={`
            flex items-center gap-1 sm:gap-1.5 px-3 sm:px-3.5 md:px-4 py-2 sm:py-2.5 rounded-lg
            text-xs sm:text-sm font-medium transition-all duration-200
            ${
              isFirstPage
                ? "opacity-50 cursor-not-allowed text-[#666666] bg-white border border-[#DEE2E680]"
                : "text-[#666666] bg-white border border-[#DEE2E680] hover:bg-[#F7FAFC] cursor-pointer active:bg-[#F0F4F8]"
            }
            w-auto min-w-[65px] sm:min-w-[75px] md:min-w-[85px]
            justify-center h-8 sm:h-9 md:h-9
          `}
          aria-label="Previous page"
        >
          <ChevronLeftIcon />
          <span>Back</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5">
          {getPageNumbers.map((page, index) => {
            if (page === "ellipsis") {
              return (
                <button
                  key={`ellipsis-${index}`}
                  disabled
                  className="
                    w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg
                    text-xs sm:text-sm md:text-base font-medium
                    text-[#666666] bg-white border border-[#DEE2E680]
                    flex items-center justify-center
                    cursor-default
                  "
                  aria-label="More pages"
                >
                  ...
                </button>
              );
            }

            const pageNum = page as number;
            const isActive = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`
                  w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-9 rounded-lg
                  text-xs sm:text-sm md:text-base font-medium transition-all duration-200
                  flex items-center bg-custom-teal justify-center
                  ${
                    isActive
                      ? "bg-[#3F5893] text-white border-0 shadow-sm"
                      : "text-[#666666] bg-white border border-[#DEE2E680] hover:bg-[#F7FAFC] cursor-pointer active:bg-[#F0F4F8]"
                  }
                `}
                aria-label={`Go to page ${pageNum}`}
                aria-current={isActive ? "page" : undefined}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={isLastPage}
          className={`
            flex items-center gap-1 sm:gap-1.5 px-3 sm:px-3.5 md:px-4 py-2 sm:py-2.5 rounded-lg
            text-xs sm:text-sm font-medium transition-all duration-200
            ${
              isLastPage
                ? "opacity-50 cursor-not-allowed text-[#666666] bg-white border border-[#DEE2E680]"
                : "text-[#666666] bg-white border border-[#DEE2E680] hover:bg-[#F7FAFC] cursor-pointer active:bg-[#F0F4F8]"
            }
            w-auto min-w-[65px] sm:min-w-[75px] md:min-w-[85px]
            justify-center h-8 sm:h-9 md:h-9
          `}
          aria-label="Next page"
        >
          <span>Next</span>
          <ChevronRightIcon />
        </button>
      </div>
    );
  }
);

Pagination.displayName = "Pagination";

export default Pagination;
