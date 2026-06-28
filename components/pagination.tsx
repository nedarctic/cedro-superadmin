'use client'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchParams } from "next/navigation";

type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export function PaginationComponent({
  meta,
}: {
  meta: PaginationMeta;
}) {
  const searchParams = useSearchParams();

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);

    params.set("page", page.toString());

    return `/bookings?${params.toString()}`;
  };

  const hasPrevious = meta.page > 1;
  const hasNext = meta.page < meta.totalPages;

  return (
    <Pagination>
      <PaginationContent>

        {hasPrevious && (
          <PaginationItem>
            <PaginationPrevious href={createPageUrl(meta.page - 1)} />
          </PaginationItem>
        )}

        {meta.page > 1 && (
          <PaginationItem>
            <PaginationLink href={createPageUrl(meta.page - 1)}>
              {meta.page - 1}
            </PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationLink
            href={createPageUrl(meta.page)}
            isActive
          >
            {meta.page}
          </PaginationLink>
        </PaginationItem>

        {hasNext && (
          <PaginationItem>
            <PaginationLink href={createPageUrl(meta.page + 1)}>
              {meta.page + 1}
            </PaginationLink>
          </PaginationItem>
        )}

        {meta.totalPages - meta.page > 1 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {hasNext && (
          <PaginationItem>
            <PaginationNext href={createPageUrl(meta.page + 1)} />
          </PaginationItem>
        )}

      </PaginationContent>
    </Pagination>
  );
}