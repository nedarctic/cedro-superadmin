import { BreadCrumb } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import { PencilIcon } from "lucide-react"
import { getTour } from "@/lib/helpers/tours.helpers";
import { EditAssetBtn } from "@/components/edit-asset-btn";
import { DeleteAssetBtn } from "@/components/delete-asset-btn";

export default async function TourDetailsPage({ params }: { params: Promise<{ tourId: string }> }) {

    const { tourId } = await params;
    const { success, data, error } = await getTour(tourId)

    !success && console.log('An error occurred fetching tour', error);
    success && console.log('Successfully fetched tour data', data);

    const crumbs = [
        { label: 'Tours', link: '/tours' },
    ]

    return (
        <div className="flex flex-col py-6 ml-4 mr-6 gap-6 h-full">
            <div className="flex justify-between">
                <BreadCrumb crumbs={crumbs} currentPage="Tour Details" />
                <div className="flex items-center gap-4">
                    <EditAssetBtn path={`/tours/${tourId}/edit-booking`} label={"Edit Tour"}/>
                    <DeleteAssetBtn label="Delete Tour" />
                </div>
            </div>
            <div className="min-h-4/5 flex flex-col items-start justify-start">
                <h1 className="font-bold text-xl">{data?.title}</h1>
            </div>
        </div>
    )
}