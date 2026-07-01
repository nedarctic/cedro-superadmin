import { BreadCrumb } from "@/components/breadcrumb";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default async function TeamPage() {
    return (
        <div className="flex flex-col py-6 ml-4 mr-6 gap-6">
            <div className="flex justify-between">
                <BreadCrumb currentPage="Team" />
                <Link className="flex gap-2 py-1 px-2 border-black text-sm bg-black rounded-md text-white items-center" href="/team/create-member">Add new member <PlusIcon size={16} /> </Link>
            </div>
        </div>
    )
}