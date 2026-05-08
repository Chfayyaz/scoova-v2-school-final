"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/ui/Button";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = [];
  
  // Show first 3 pages, ellipsis, last 2 pages
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1, 2, 3);
    pages.push("...");
    pages.push(totalPages - 1, totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 mt-6 sm:mt-8 overflow-x-auto lg:overflow-visible">
      <Button
        variant="ghosted"
        rounded="full"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        textColor="text-custom-gray/70"
        hoverTextColor="hover:text-custom-teal"
        className="px-2 sm:px-3 py-2 flex-shrink-0 text-sm"
      >
        <ChevronLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
      </Button>

      {pages.map((page, index) => {
        if (page === "...") {
          return (
            <span key={`ellipsis-${index}`} className="px-1 sm:px-2 text-custom-gray/70 text-xs sm:text-sm">
              ...
            </span>
          );
        }

        const pageNum = page as number;
        const isActive = pageNum === currentPage;

        return (
          <Button
            key={pageNum}
            variant={isActive ? "filled" : "ghosted"}
            rounded="full"
            onClick={() => onPageChange(pageNum)}
            textColor={isActive ? "text-custom-white" : "text-custom-gray/70"}
            hoverTextColor={isActive ? undefined : "hover:text-custom-teal"}
            bgColor={isActive ? "bg-custom-teal" : undefined}
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm flex-shrink-0"
          >
            {pageNum}
          </Button>
        );
      })}

      <Button
        variant="ghosted"
        rounded="full"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        textColor="text-custom-gray/70"
        hoverTextColor="hover:text-custom-teal"
        className="px-2 sm:px-3 py-2 flex-shrink-0 text-sm"
      >
        <ChevronRight size={16} className="sm:w-[18px] sm:h-[18px]" />
      </Button>
    </div>
  );
}

