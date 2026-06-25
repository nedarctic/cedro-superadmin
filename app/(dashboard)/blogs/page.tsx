import { BreadCrumb } from "@/components/breadcrumb";

export default async function BlogsPage () {
    return (
        <div className="flex flex-col py-6">
              <BreadCrumb currentPage="Blogs" />
        </div>
    )
}