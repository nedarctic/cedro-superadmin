import { BreadCrumb } from "@/components/breadcrumb";
import { DeleteTourBtn } from "@/components/delete-tour-btn";
import { EditAssetBtn } from "@/components/edit-asset-btn";
import { getTour } from "@/lib/helpers/tours.helpers";
import { notFound } from "next/navigation";

export default async function TourDetailsPage({ params }: { params: Promise<{ tourId: string }> }) {

    const { tourId } = await params;
    const { success, data, error } = await getTour(tourId)

    if (!success) {
        return notFound();
    }

    const crumbs = [
        { label: 'Tours', link: '/tours' },
    ]

    return (
        <div className="flex flex-col py-6 ml-4 mr-6 gap-6 h-full">
            <div className="flex justify-between">
                <BreadCrumb crumbs={crumbs} currentPage="Tour Details" />
                <div className="flex items-center gap-4">
                    <EditAssetBtn path={`/tours/${tourId}/edit-tour`} label={"Edit Tour"} />
                    <DeleteTourBtn destinationId={data?.destinationId!} tourId={tourId} />
                </div>
            </div>
            <div className="min-h-4/5 flex flex-col items-start justify-start">
                <h1 className="font-bold text-xl">{data?.title}</h1>
            </div>
        </div>
    )
}