import { BreadCrumb } from "@/components/breadcrumb";
import { TableData } from "@/components/table-data";
import { SearchInput } from "@/components/search-input";
import { PaginationComponent } from "@/components/pagination";
import { getBookings } from "@/lib/helpers/bookings.helpers";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { CreateAssetBtn } from "@/components/create-asset-btn";

export default async function BookingsPage(
    { searchParams }: {
        searchParams: Promise<{
            page?: string;
            limit?: string;
            search?: string;
        }>
    }
) {

    const { limit = "10", page, search } = await searchParams;
    const { success, data, error } = await getBookings({ page, limit, search });

    const { bookings, meta } = data;

    error && console.log('An error occurred fetching bookings', error);
    success && console.log('Successfully fetched bookings');

    const headers = [
        { label: 'Name', key: 'name' },
        { label: 'Email', key: 'email' },
        { label: 'Tour', key: 'tourTitle' },
    ];

    return (
        <div className="flex flex-col py-6 ml-4 mr-6 gap-6 h-full">
            <div className="flex justify-between">
                <BreadCrumb currentPage="Bookings" />
                <CreateAssetBtn path={"/bookings/create-booking"} label={"Create Booking"}/>
            </div>
            <SearchInput placeholder="Search bookings..." />
            <div className="flex flex-col justify-between min-h-4/5">
                {bookings.length ? <TableData path={"/bookings"} headers={headers} data={bookings} /> : <p className="text-sm font-medium">No bookings at the moment</p>}
                {bookings.length ? <PaginationComponent meta={meta} /> : ''}
            </div>
        </div>
    );
}