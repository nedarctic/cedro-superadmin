import { BreadCrumb } from "@/components/breadcrumb";

export default function Page() {

  return (
    <div className="flex flex-col py-6">
      <BreadCrumb currentPage="Dashboard" />
    </div>
  )
}
