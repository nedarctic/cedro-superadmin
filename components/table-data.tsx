'use client'

import { Booking } from "@/lib/types/booking";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { useSearchParams } from "next/navigation";

export function TableData({ bookingData }: { bookingData: Booking }) {
    const searchParams = useSearchParams();

    const page = parseInt(searchParams.get('page') || "1", 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Index</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Tour</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {bookingData.map((booking, index) =>
                    <TableRow key={booking.id}>
                        <TableCell>{skip + index + 1}</TableCell>
                        <TableCell>{booking.name}</TableCell>
                        <TableCell>{booking.email}</TableCell>
                        <TableCell>{booking.tour.title}</TableCell>
                    </TableRow>)}
            </TableBody>
        </Table>
    );
}