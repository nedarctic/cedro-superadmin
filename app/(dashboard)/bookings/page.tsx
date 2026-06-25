import { BreadCrumb } from "@/components/breadcrumb";

export default async function BookingsPage () {
    return (
        <div className="flex flex-col py-6">
              <BreadCrumb currentPage="Bookings" />
        </div>
    );    
}