import { BreadCrumb } from "@/components/breadcrumb"
import { EditDestinationForm } from "@/components/edit-destination-form";
import { getDestination } from "@/lib/helpers/destinations.helpers";

export default async function EditDestinationPage({ params }: { params: Promise<{ destinationId: string }> }) {

    const { destinationId } = await params;
    const { success, data, error } = await getDestination(destinationId);

    const crumbs = [
        { label: "Destinations", link: "/destinations" },
        { label: "Destination Details", link: `/destinations/${destinationId}` }
    ];

    if (!success) {
        return <div className="flex flex-col gap-6 min-h-screen">
            <BreadCrumb currentPage="Edit Destination" crumbs={crumbs} />

            <p className="text-md">Failed to fetch destination details. Please refresh the page or try editing the destination later.</p>
        </div>
    }

    console.log("destination details in edit destination page", data);
    return <div className="flex flex-col gap-6 min-h-screen w-full">
        <BreadCrumb currentPage="Edit Destination" crumbs={crumbs} />

        <h1 className="text-lg font-semibold">Edit Destination</h1>
        <EditDestinationForm destination={data!} />
    </div>
}