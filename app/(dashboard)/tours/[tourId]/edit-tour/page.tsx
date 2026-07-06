import { BreadCrumb } from "@/components/breadcrumb";
import { UpdateTourTestForm } from "@/components/update-tour-test-form";
import { getTour } from "@/lib/helpers/tours.helpers";
import { notFound } from "next/navigation";
import { getDestinations } from "@/lib/helpers/destinations.helpers";

export default async function UpdateTourPage({ params }: {
    params: Promise<{
        tourId: string;
    }>
}) {
    const { tourId } = await params;
    const { success, data: tour, error } = await getTour(tourId);
    const { data: destinations } = await getDestinations();

    if (!success) {
        return notFound();
    }

    const crumbs = [
        { label: 'Tours', link: '/tours' },
        { label: 'Tour Details', link: `/tours/${tourId}` }
    ]

    return (
        <div className="flex flex-col py-6 ml-4 mr-6 gap-6 h-full">
            <BreadCrumb crumbs={crumbs} currentPage="Edit Tour" />
            <h1 className="font-bold text-xl">Edit Tour Form</h1>
            <UpdateTourTestForm tour={tour!} destinations={destinations?.destinations!} />
        </div>
    )
}