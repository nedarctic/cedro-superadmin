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
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

type PaginationMeta = {
  page: number;
  limit?: number;
  total: number;
  totalPages?: number;
};

export function PaginationComponent({
  meta,
}: {
  meta: PaginationMeta;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const hasPrevious = meta.page > 1;
  const hasNext = meta.page < meta?.totalPages!;

  const handleNext = () => {
    const params = new URLSearchParams(searchParams);
    params.set('page', (meta.page + 1).toString())
    router.push(`?${params.toString()}`)
  }

  const handlePrevious = () => {
    const params = new URLSearchParams(searchParams);
    params.set('page', (meta.page - 1).toString())
    router.push(`?${params.toString()}`);
  }

  return (
    <Pagination>
      <PaginationContent>


        <PaginationItem>
          <Button
            variant="ghost"
            onClick={handlePrevious} disabled={!hasPrevious}><PaginationPrevious /></Button>
        </PaginationItem>


        {meta.page > 1 && (
          <PaginationItem>
            <Button onClick={handlePrevious} variant="ghost">{meta.page - 1}</Button>
          </PaginationItem>
        )}

        <PaginationItem>
          <Button
            onClick={() => router.refresh()}
            variant="outline">{meta.page}</Button>
        </PaginationItem>

        {hasNext && (
          <PaginationItem>
            <Button
              onClick={handleNext}
              variant="ghost"
            >{meta.page + 1}</Button>
          </PaginationItem>
        )}

        {meta?.totalPages! - meta.page > 1 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        <PaginationItem>
          <Button
            variant="ghost"
            onClick={handleNext}
            disabled={!hasNext}><PaginationNext /></Button>
        </PaginationItem>


      </PaginationContent>
    </Pagination>
  );
}