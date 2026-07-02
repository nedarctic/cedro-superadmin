import { BreadCrumb } from "@/components/breadcrumb";
import { CreateBlogForm } from "@/components/create-blog-form";
import { CreateBookingForm } from "@/components/create-booking-form";
import { getDestinations } from "@/lib/helpers/destinations.helpers";
import { getTours } from "@/lib/helpers/tours.helpers";

export default async function CreateBookingPage() {

    const {
        success: toursSuccess,
        data: toursData,
        error: toursError
    } = await getTours({});
    const {
        success: destinationsSuccess,
        data: destinationsData,
        error: destinationsError
    } = await getDestinations();

    !toursSuccess && console.log('Failed to fetch tours', toursError);
    !destinationsSuccess && console.log('Failed to fetch destinations', destinationsError)
   
    const crumbs = [
        { label: "Bookings", link: '/bookings' },
    ];

    return (
        <div className="flex flex-col py-6 ml-4 mr-6 gap-6">
            <BreadCrumb crumbs={crumbs} currentPage="Create Booking" />

            <h1 className="font-bold text-xl">Booking Creation Form</h1>
            <CreateBookingForm destinations={destinationsData?.destinations!} tours={toursData?.tours!} />
        </div>
    );
}