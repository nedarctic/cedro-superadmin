import { BreadCrumb } from "@/components/breadcrumb";
import { DeleteTourBtn } from "@/components/delete-tour-btn";
import { EditAssetBtn } from "@/components/edit-asset-btn";
import { getTour } from "@/lib/helpers/tours.helpers";
import Image from "next/image";
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
                <h1 className="font-extrabold text-xl lg:text-3xl">{data?.title}</h1>
                <div className="flex md:flex-row flex-col gap-4 justify-between w-full my-4">
                    <div className="relative aspect-video flex-2 max-w-4xl">
                        <Image className="rounded-2xl" unoptimized fill src={data?.tourImageUrl!} alt="Tour image" />
                    </div>
                    <div className="flex-1 space-y-2">
                        <p className="font-normal text-md">{data?.description}</p>
                        <p><span className="font-bold text-md">Price: </span>{new Intl.NumberFormat("en-US", { currency: "USD", style: "currency" }).format(parseInt(data?.price!, 10))}</p>
                        <p><span className="font-bold text-md">Dates: </span>{data?.dates}</p>
                        <p><span className="font-bold text-md">Destination: </span>{data?.destination.name}</p>
                        <p><span className="font-bold text-md">Duration: </span>{data?.duration}</p>
                        <p><span className="font-bold text-md">Group size: </span>{data?.groupSize}</p>
                        <p><span className="font-bold text-md">Total bookings: </span>{data?.totalBookings}</p>

                    </div>
                </div>
                <div className="flex md:flex-row flex-col justify-between w-full mt-4">
                    <div>
                        <p className="font-bold text-md">Activities:</p>
                        <ul className="list-disc pl-4">{data?.activities.map((activity, index) => <li key={index}>{activity}</li>)}</ul>
                    </div>
                    <div>
                        <p className="font-bold text-md">Included:</p>
                        <ul className="list-disc pl-4">{data?.included.map((includedItem, index) => <li key={index}>{includedItem}</li>)}</ul>
                    </div>
                    <div><p className="font-bold text-md">Excluded:</p>
                        <ul className="list-disc pl-4">{data?.excluded.map((excludedItem, index) => <li key={index}>{excludedItem}</li>)}</ul>
                    </div>
                </div>
                <div className="flex flex-col w-full mt-4">
                    <h2 className="font-bold text-lg my-2">Itineraries</h2>
                    <ul className="flex flex-col gap-4">{data?.itineraries.map((itinerary, itineraryIndex) => <li key={itineraryIndex} className="rounded-2xl border-2 p-4">
                        <p className="bg-green-600 max-w-fit *:text-black rounded-lg py-1 px-2">{itinerary.day}</p>
                        <p className="font-bold">{itinerary.subtitle}</p>
                        <p className="font-semibold">Activities:</p>
                        <ul className="list-disc pl-4">
                            {itinerary.activities.map((activity, index) => <li key={index}>{activity}</li>)}
                        </ul>
                        <div className="relative aspect-video w-full mt-3">
                            <Image src={itinerary.itineraryImageUrl}
                            fill
                            className="rounded-2xl" 
                            alt={`${itinerary.day} itinerary image`} />
                        </div>
                    </li>)}
                    </ul>
                </div>
            </div>
        </div>
    )
}