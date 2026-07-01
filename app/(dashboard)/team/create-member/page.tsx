import { BreadCrumb } from "@/components/breadcrumb";
import { CreateMemberForm } from "@/components/create-member-form";

export default async function () {

    const crumbs = [
        { label: "Team", link: '/team' }
    ];
    return (
        <div className="flex flex-col py-6 ml-4 mr-6 gap-6">
            <div className="flex justify-between">
                <BreadCrumb crumbs={crumbs} currentPage="Create Team Member" />
            </div>

            <h1 className="font-bold text-xl">Team Member Creation Form</h1>
            <CreateMemberForm />
        </div>
    )
}