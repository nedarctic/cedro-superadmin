import { BreadCrumb } from "@/components/breadcrumb";
import { getDashKpis } from "@/lib/helpers/dash.helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { KPICard } from "@/components/kpi-card";

export default async function Page() {

  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login')
  }
  const { accessToken } = session;

  const { data, success, error } = await getDashKpis(accessToken);

  console.log(data)

  return (
    <div className="flex flex-col py-6 ml-4 mr-6 gap-6 h-full">
      <BreadCrumb currentPage="Dashboard" />

      <div className="flex flex-row gap-4 flex-wrap">
        <KPICard label={"Total Bookings"} stat={data?.totalBookings!} />
        <KPICard label={"Total Tours"} stat={data?.totalTours!} />
        <KPICard label={"Total Members"} stat={data?.totalMembers!} />
        <KPICard label={"Total Destinations"} stat={data?.totalDestinations!} />
        <KPICard label={"Total Blogs"} stat={data?.totalBlogs!} />
      </div>
    </div>
  )
}
