import { BreadCrumb } from "@/components/breadcrumb";

export default async function TeamPage () {
    return (
        <div className="flex flex-col py-6">
              <BreadCrumb currentPage="Team" />
        </div>
    )
}