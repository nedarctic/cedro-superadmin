import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { BreadCrumb } from "@/components/breadcrumb";
import { DeleteBookingBtn } from "@/components/delete-booking-btn";
import { UpdateBookingDrawer } from "@/components/update-booking-drawer";
import { getBooking } from "@/lib/helpers/bookings.helpers";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function BookingDetailsPage({ params }: { params: Promise<{ bookingId: string }> }) {

    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/login");
    }
    const { accessToken } = session;
    const { bookingId } = await params;

    const url = `${process.env.NEST_API_URL}/bookings/${bookingId}`;

    const { data, success } = await getBooking(bookingId, accessToken, url);

    const crumbs = [
        { label: 'Bookings', link: '/bookings' },
    ]

    if (!success) {
        return <div className="flex flex-col py-6 ml-4 mr-6 gap-6 min-h-screen">
            <BreadCrumb crumbs={crumbs} currentPage="Booking Details" />
            <p className="text-md">Failed to fetch booking details.</p>
        </div>
    }

    return (
        <div className="flex flex-col py-6 ml-4 mr-6 gap-6 min-h-screen">
            <div className="flex justify-between">
                <BreadCrumb crumbs={crumbs} currentPage="Booking Details" />
                <div className="flex items-center gap-4">
                    <UpdateBookingDrawer booking={data!} />
                    <DeleteBookingBtn
                        bookingId={bookingId}
                        destinationId={data?.tour?.destinationId!}
                        tourId={data?.tourId!}
                    />
                </div>
            </div>
            <div className="h-full w-full flex flex-col items-start justify-start space-y-6">
                <h1 className="font-bold text-xl">{data?.name}&apos;s {data?.tour.title} Booking Details</h1>
                <div className="flex flex-col gap-2 w-full h-full">
                    <div className="relative aspect-video w-full max-w-7xl ">
                        <Image src={data?.tour?.tourImage!} alt={"Tour image"} fill unoptimized className="rounded-2xl" />
                    </div>
                    <p><span className="font-bold">Name: </span>{data?.name}</p>
                    <p><span className="font-bold">Email: </span>{data?.email}</p>
                    <p><span className="font-bold">Tour: </span>{data?.tour?.title}</p>
                    <p><span className="font-bold">Destination: </span>{data?.tour?.destination?.name}</p>
                </div>
            </div>
        </div>
    )
}