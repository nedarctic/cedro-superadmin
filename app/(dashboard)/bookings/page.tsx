import { BreadCrumb } from "@/components/breadcrumb";
import { TableData } from "@/components/table-data";
import { SearchInput } from "@/components/search-input";
import { PaginationComponent } from "@/components/pagination";
import { getBookings } from "@/lib/helpers/bookings.helpers";

export default async function BookingsPage(
    { searchParams }: {
        searchParams: Promise<{
            page?: string;
            limit?: string;
            search?: string;
        }>
    }
) {

    const { limit, page, search } = await searchParams;
    const { success, data, error } = await getBookings({ page, limit, search });

    const {bookings, meta} = data;

    error && console.log('An error occurred fetching bookings', error);
    success && console.log('Successfully fetched bookings', bookings);

    return (
        <div className="flex flex-col py-6 ml-4 mr-6 gap-6">
            <BreadCrumb currentPage="Bookings" />
            <SearchInput />
            <TableData bookingData={bookings} />
            <PaginationComponent meta={meta} />
        </div>
    );
}