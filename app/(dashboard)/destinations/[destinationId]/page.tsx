import { BreadCrumb } from "@/components/breadcrumb";
import { Table, TableBody, TableRow } from "@/components/ui/table";
import { getDestination } from "@/lib/helpers/destinations.helpers";
import { PenIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function DestinationDetailPage({ params }: { params: Promise<{ destinationId: string }> }) {
    const { destinationId } = await params;
    console.log("destination id", destinationId);

    const crumbs = [
        { label: "Destinations", link: "/destinations" }
    ];

    const { success, data, error } = await getDestination(destinationId);

    if (!success) {
        return <div className="flex flex-col min-h-screen gap-6">
            <BreadCrumb currentPage="Destination Details" crumbs={crumbs} />
            <p className="text-md">Failed to fetch destination details. Please refresh the page or try again later.</p>
        </div>
    }

    console.log("destination details", data)

    return <div className="flex flex-col min-h-screen gap-6">
        <BreadCrumb crumbs={crumbs} currentPage="Destination Details" />

        <div className="flex flex-row justify-between">
            <h1 className="font-semibold text-lg">Destination details</h1>
            <Link href={`/destinations/${destinationId}/edit-destination`} className="flex flex-row items-center gap-2"><PenIcon size={16} />Edit destination</Link>
        </div>

        <h1 className="text-lg font-bold">{data?.name}</h1>
        <div className="relative aspect-video max-w-7xl w-full">
            <Image
                unoptimized
                fill
                className="object-cover object-top rounded-2xl"
                src={data?.destinationImageUrl!}
                alt={data?.name!}
            />
        </div>

        {data?.destinationGuides ? <ul className="list-none">
            {data.destinationGuides.map((guide, index) => <li key={index}>
                <h2 className="text-md font-semibold">{guide.subtitle}</h2>
                <p className="text-md">{guide.subtitle}</p>
            </li>)} </ul> :
            <p className="text-md">There is no guide for destination at the moment. Edit the destination to add a guide.</p>}

    </div>
}