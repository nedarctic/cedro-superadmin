import { BookingDataChart } from "@/components/booking-chart";
import { BreadCrumb } from "@/components/breadcrumb";
import { KPICard } from "@/components/kpi-card";
import { getBookingChartData, getDashKpis } from "@/lib/helpers/dash.helpers";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function Page() {
  const monthlyBookings = {
    February: 0,
    March: 0,
    April: 0,
    May: 0,
    June: 0,
    July: 2,
  }

  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login')
  }
  const { accessToken } = session;

  const { data, success, error } = await getDashKpis(accessToken);
  const { data: bookingData } = await getBookingChartData(accessToken);

  console.log("Booking chart data:", bookingData);

  console.log(data)

  return (
    <div className="flex flex-col py-6 ml-4 mr-6 gap-6 h-full">
      <BreadCrumb currentPage="Dashboard" />

      <h1 className="font-bold text-xl">Dashboard</h1>
      <div className="flex flex-row gap-4 flex-wrap w-full">
        <KPICard label={"Total Bookings"} stat={data?.totalBookings!} />
        <KPICard label={"Total Tours"} stat={data?.totalTours!} />
        <KPICard label={"Total Members"} stat={data?.totalMembers!} />
        <KPICard label={"Total Destinations"} stat={data?.totalDestinations!} />
        <KPICard label={"Total Blogs"} stat={data?.totalBlogs!} />
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
        <BookingDataChart data={monthlyBookings} />
        </div>
        <div className="flex flex-col gap-3 p-4 flex-1 border-2 rounded-2xl">
          <h2 className="font-bold text-lg">Recent Bookings</h2>
          <ul className="flex flex-col gap-2 list-disc pl-4">{data?.recentBookings.map((booking, index) => <li key={index} 
          className="text-md" >{booking.tour.title} by {booking.email}</li>)}</ul>
        </div>
      </div>
    </div>
  )
}
