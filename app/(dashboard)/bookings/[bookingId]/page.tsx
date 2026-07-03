import { BreadCrumb } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import { PencilIcon } from "lucide-react"
import { getBooking } from "@/lib/helpers/bookings.helpers";

export default async function BookingDetailsPage({ params }: { params: Promise<{ bookingId: string }> }) {

    const { bookingId } = await params;
    const { success, data, error } = await getBooking(bookingId)

    !success && console.log('An error occurred fetching booking', error);
    success && console.log('Successfully fetched booking data', data);

    const crumbs = [
        { label: 'Bookings', link: '/bookings' },
    ]

    return (
        <div className="flex flex-col py-6 ml-4 mr-6 gap-6 h-full">
            <div className="flex justify-between">
                <BreadCrumb crumbs={crumbs} currentPage="Booking Details" />
                <div className="flex items-center gap-4">
                    <Button variant="outline"><PencilIcon size={16} />Edit Booking</Button>
                    <Button variant="destructive">Delete Booking</Button>
                </div>
            </div>
            <div className="min-h-4/5 flex flex-col items-start justify-start">
                <h1 className="font-bold text-xl">{data?.tourTitle}</h1>
            </div>
        </div>
    )
}