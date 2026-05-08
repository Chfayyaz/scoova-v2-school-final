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
  
  // Always show first page
  pages.push(1);
  
  // Show pages around current page
  if (currentPage > 3) {
    pages.push("...");
  }
  
  for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
    if (!pages.includes(i)) {
      pages.push(i);
    }
  }
  
  // Show last pages
  if (currentPage < totalPages - 2) {
    if (!pages.includes("...")) {
      pages.push("...");
    }
  }
  
  if (totalPages > 1 && !pages.includes(totalPages)) {
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant="ghosted"
        rounded="full"
        textColor="text-custom-gray/95"
        hoverTextColor="hover:text-custom-teal"
        className="px-3 py-2 text-sm"
      >
        <ChevronLeft size={16} className="inline mr-1" />
        Back
      </Button>

      <div className="flex items-center gap-2">
        {pages.map((page, index) => {
          if (page === "...") {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-custom-gray/60">
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <Button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              variant={isActive ? "filled" : "ghosted"}
              rounded="full"
              bgColor={isActive ? "bg-custom-teal" : undefined}
              textColor={isActive ? "text-custom-white" : "text-custom-gray/95"}
              hoverBgColor={isActive ? undefined : "hover:bg-custom-gray/10"}
              className="w-8 h-8 p-0 text-sm font-medium"
            >
              {pageNum}
            </Button>
          );
        })}
      </div>

      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="ghosted"
        rounded="full"
        textColor="text-custom-gray/95"
        hoverTextColor="hover:text-custom-teal"
        className="px-3 py-2 text-sm"
      >
        Next
        <ChevronRight size={16} className="inline ml-1" />
      </Button>
    </div>
  );
}

