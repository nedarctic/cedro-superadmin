import { BreadCrumb } from "@/components/breadcrumb";
import { PaginationComponent } from "@/components/pagination";
import { SearchInput } from "@/components/search-input";
import { TableData } from "@/components/table-data";
import { getDestinations } from "@/lib/helpers/destinations.helpers";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default async function DestinationsPage({ searchParams }: {
    searchParams: Promise<{
        search?: string;
        page?: string;
        limit?: string;
    }>
}) {

    const {
        limit = "10",
        page = "1",
        search
    } = await searchParams;

    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", limit);
    search && params.append("search", search);

    const url = `${process.env.NEST_API_URL}/destinations?${params.toString()}`;

    const { data, success, error } = await getDestinations(url);
    
    if(!success){
        return <div className="flex flex-col gap-6 pl-4 pr-6 py-6">
            <BreadCrumb currentPage={"Destinations"} />
            <p>Failed to get destinations. Please refresh the page or try again later.</p>
        </div>
    }

    const { destinations, meta } = data;

    const headers = [
        { label: "Name", key: "name" },
        { label: "Created", key: "createdAt" },
        { label: "Tours", key: "totalTours" }
    ]

    return <div className="flex flex-col gap-6 pl-4 pr-6 py-6">
        <div className="flex flex-row items-center justify-between">
            <BreadCrumb currentPage={"Destinations"} />
            <Link className="flex flex-row items-center gap-2" href={"/destinations/add-destination"}><PlusIcon size={16}/>Add destination</Link>
        </div>
        <SearchInput placeholder={"Search destinations..."} />
        <TableData data={destinations} headers={headers} path={"/destinations"} />
        <PaginationComponent meta={meta} />
    </div>
}