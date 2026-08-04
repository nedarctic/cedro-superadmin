import { BreadCrumb } from "@/components/breadcrumb";
import CreateTourForm from "@/components/create-tour-form";
import { getDestinations } from "@/lib/helpers/destinations.helpers";

export default async function CreateTourPage() {
    
    const crumbs = [
        {label: "Tours", link: '/tours'},
    ];

    const url = `${process.env.NEST_API_URL}/destinations/all`;
    const { data, success } = await getDestinations(url);
    
    const destinations = Array.isArray(data) ? data : data?.destinations;
    const items = destinations?.map(destination => ({ label: destination.name, value: destination.id })) ?? [];

    return (
        <div className="flex flex-col py-6 ml-4 mr-6 gap-6">
            <BreadCrumb crumbs={crumbs} currentPage="Create Tour" />

            <h1 className="font-bold text-xl">Tour Creation Form</h1>

            <CreateTourForm items={items!} />
        </div>
    );
}