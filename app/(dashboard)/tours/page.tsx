import { BreadCrumb } from "@/components/breadcrumb";
import { PaginationComponent } from "@/components/pagination";
import { SearchInput } from "@/components/search-input";
import { TableData } from "@/components/table-data";
import { Button } from "@/components/ui/button";
import { getTours } from "@/lib/helpers/tours.helpers";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default async function ToursPage({ searchParams }: {
    searchParams: Promise<{
        page?: string;
        limit?: string;
        search?: string;
    }>
}) {

    const { limit, page, search } = await searchParams;
    const { success, data, error } = await getTours({ limit, page, search });

    error && console.error('An error occurred fetching tours data', error);
    success && data && console.log('Successfully fetched tours data', data);

    const { tours, meta } = data!;

    const headers = [
        { label: "Title", key: "title" },
        { label: 'Bookings', key: 'totalBookings' }
    ];

    return (
        <div className="flex flex-col py-6 ml-4 mr-6 gap-6">
            <div className="flex justify-between">
            <BreadCrumb currentPage="Tours" />
            <Link className="flex gap-2 py-1 px-2 border-black text-sm bg-black rounded-md text-white items-center" href="/tours/create-tour">Create new tour <PlusIcon size={16}/> </Link>
            </div>
            <SearchInput path="tours" placeholder="Search tours..." />
            <TableData headers={headers} data={tours} />
            <PaginationComponent path="tours" meta={meta} />
        </div>
    )
}