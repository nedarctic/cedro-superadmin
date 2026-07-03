import { BreadCrumb } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import { PencilIcon } from "lucide-react"
import { getTour } from "@/lib/helpers/tours.helpers";

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
                    <Button variant="outline"><PencilIcon size={16} />Edit Tour</Button>
                    <Button variant="destructive">Delete Tour</Button>
                </div>
            </div>
            <div className="min-h-4/5 flex flex-col items-start justify-start">
                <h1 className="font-bold text-xl">{data?.title}</h1>
            </div>
        </div>
    )
}