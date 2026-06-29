'use client'

import { Booking } from "@/lib/types/booking";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { useSearchParams } from "next/navigation";

export function TableData({
    headers,
    data
}: {
    data: any,
    headers: {
        label: string,
        key: string
    }[]
}) {
    const searchParams = useSearchParams();

    const page = parseInt(searchParams.get('page') || "1", 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="font-bold">ID</TableHead>
                    {headers.map(({ label }, index) => <TableHead className={`font-bold ${index === headers.length - 1 ? 'text-right' : ''}`} key={index}>{label}</TableHead>)}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((item: any, index: number) =>
                    <TableRow key={item.id}>
                        <TableCell>{skip + index + 1}</TableCell>
                        {headers.map(({ key }, index) => (
                            <TableCell className={`${index === headers.length - 1 ? 'text-right' : ''}`} key={index}>{item[key]}</TableCell>
                        ))}
                    </TableRow>)}
            </TableBody>
        </Table>
    );
}