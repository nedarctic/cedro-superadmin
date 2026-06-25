import { BreadCrumb } from "@/components/breadcrumb";

export default function Page() {

  const crumbs = [
    {label: "Home", link: '/'}
  ];

  return (
    <div className="flex flex-col py-6">
      <BreadCrumb crumbs={crumbs} currentPage="Dashboard" />
    </div>
  )
}
