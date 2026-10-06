import { BreadCrumb } from "@/components/breadcrumb";
import { DeleteTourBtn } from "@/components/delete-tour-btn";
import { EditAssetBtn } from "@/components/edit-asset-btn";
import { getTour } from "@/lib/helpers/tours.helpers";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function TourDetailsPage({ params }: { params: Promise<{ tourId: string }> }) {
    const { tourId } = await params;
    const { success, data } = await getTour(tourId);

    if (!success || !data) {
        return notFound();
    }

    const crumbs = [{ label: 'Tours', link: '/tours' }];
    const destinationName = data?.destination?.name ?? 'Unknown destination';
    const activities = data?.activities ?? [];
    const included = data?.included ?? [];
    const excluded = data?.excluded ?? [];
    const itinerary = data?.itinerary ?? [];
    const price = data?.price ?? 0;

    return (
        <div className="flex flex-col py-6 ml-4 mr-6 gap-6 h-full">
            <div className="flex justify-between">
                <BreadCrumb crumbs={crumbs} currentPage="Tour Details" />
                <div className="flex items-center gap-4">
                    <EditAssetBtn path={`/tours/${tourId}/edit-tour`} label={"Edit Tour"} />
                    <DeleteTourBtn destinationId={data?.destinationId ?? ''} tourId={tourId} />
                </div>
            </div>
            <div className="min-h-4/5 flex flex-col items-start justify-start gap-6">
                <h1 className="font-extrabold text-xl lg:text-2xl">{data?.title}</h1>
                {data?.tourImage ? (
                    <div className="relative aspect-video flex-1 max-w-7xl w-full">
                        <Image className="rounded-2xl object-cover object-center" unoptimized fill src={data.tourImage} alt="Tour image" />
                    </div>
                ) : null}
                <div className="flex lg:flex-row flex-col gap-4 justify-between w-full my-4">
                    <div className="flex-1 space-y-2">
                        <p className="font-normal text-md">{data?.intro}</p>
                        <p>
                            <span className="font-bold text-md">Price: </span>
                            {new Intl.NumberFormat("en-US", { currency: "USD", style: "currency" }).format(price)}
                        </p>
                        <p><span className="font-bold text-md">Dates: </span>{data?.dates}</p>
                        <p><span className="font-bold text-md">Destination: </span>{destinationName}</p>
                        <p><span className="font-bold text-md">Duration: </span>{data?.duration}</p>
                        <p><span className="font-bold text-md">Group size: </span>{data?.groupSize}</p>
                        <p><span className="font-bold text-md">Total bookings: </span>{data?.totalBookings}</p>
                    </div>
                </div>
                <hr className="my-4 w-full" />
                <div className="flex md:flex-row flex-col justify-between w-full mt-4 gap-4">
                    <div>
                        <p className="font-bold text-md">Activities:</p>
                        <ul className="list-disc pl-4">
                            {activities.length ? activities.map((activity, index) => <li key={index}>{activity}</li>) : <li>No activities listed.</li>}
                        </ul>
                    </div>
                    <div>
                        <p className="font-bold text-md">Included:</p>
                        <ul className="list-disc pl-4">
                            {included.length ? included.map((includedItem, index) => <li key={index}>{includedItem}</li>) : <li>No included items listed.</li>}
                        </ul>
                    </div>
                    <div>
                        <p className="font-bold text-md">Excluded:</p>
                        <ul className="list-disc pl-4">
                            {excluded.length ? excluded.map((excludedItem, index) => <li key={index}>{excludedItem}</li>) : <li>No excluded items listed.</li>}
                        </ul>
                    </div>
                </div>
                <div className="flex flex-col w-full mt-4">
                    <h2 className="font-bold text-lg my-2">Itineraries</h2>
                    <ul className="flex flex-col gap-4">
                        {itinerary.length ? itinerary.map((itineraryItem, itineraryIndex) => (
                            <li key={itineraryIndex} className="rounded-2xl border-2 p-4 flex flex-col gap-3">
                                <p className="bg-green-600 max-w-fit *:text-black rounded-lg py-1 px-2">{itineraryItem?.day}</p>
                                <p className="font-bold">{itineraryItem?.title}</p>
                                <p className="font-semibold">Activities:</p>
                                <ul className="list-disc pl-4">
                                    {(itineraryItem?.activities ?? []).length ? itineraryItem.activities.map((activity, index) => <li key={index}>{activity}</li>) : <li>No itinerary activities listed.</li>}
                                </ul>
                                {itineraryItem?.dayImage ? (
                                    <div className="relative aspect-video w-full mt-3">
                                        <Image src={itineraryItem.dayImage} fill className="rounded-2xl" alt={`${itineraryItem?.day ?? 'Itinerary'} itinerary image`} />
                                    </div>
                                ) : null}
                            </li>
                        )) : <li>No itineraries available.</li>}
                    </ul>
                </div>
            </div>
        </div>
    );
}