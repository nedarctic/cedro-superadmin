import { BreadCrumb } from "@/components/breadcrumb";

export default async function ToursPage () {
    return (
        <div className="flex flex-col py-6">
              <BreadCrumb currentPage="Tours" />
        </div>
    )
}