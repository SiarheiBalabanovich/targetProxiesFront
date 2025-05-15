import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "ui/pagination.tsx";

type PaginationListProps = {
  currentPage: number;
  totalPages: number;
  handlePageClick: (page: number) => void;
};

const PaginationList: React.FC<PaginationListProps> = ({
  currentPage,
  totalPages,
  handlePageClick,
}) => {
  return (
    <Pagination className="justify-end">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => handlePageClick(currentPage - 1)}
            className={
              currentPage === 1
                ? "pointer-events-none opacity-40"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationLink
              className="cursor-pointer"
              onClick={() => handlePageClick(currentPage - 1)}
            >
              {currentPage - 1}
            </PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationLink isActive className="cursor-pointer">
            {currentPage}
          </PaginationLink>
        </PaginationItem>
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationLink
              className="cursor-pointer"
              onClick={() => handlePageClick(currentPage + 1)}
            >
              {currentPage + 1}
            </PaginationLink>
          </PaginationItem>
        )}
        {currentPage < totalPages - 1 && totalPages > 3 && (
          <PaginationEllipsis />
        )}
        {currentPage < totalPages - 1 && totalPages > 3 && (
          <PaginationItem>
            <PaginationLink
              className="cursor-pointer"
              onClick={() => handlePageClick(totalPages)}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNext
            onClick={() => handlePageClick(currentPage + 1)}
            aria-disabled={currentPage === totalPages}
            className={
              currentPage === totalPages
                ? "pointer-events-none opacity-40"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationList;
