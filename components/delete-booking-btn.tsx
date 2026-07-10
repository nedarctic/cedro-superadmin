'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";

export function DeleteBookingBtn({ bookingId, destinationId, tourId }: {
    bookingId: string;
    destinationId: string;
    tourId: string;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    const deleteHandler = async () => {

        try {
            setLoading(true);
            const url = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/destinations/${destinationId}/tours/${tourId}/bookings/${bookingId}`;
            const res = await fetch(url, {
                method: 'DELETE'
            });
            setLoading(false);
            setOpen(false);
            const { success, data, error } = await res.json();
            if (!res.ok || !success) {
                toast.error("Delete failed", {
                    description: String(error)
                });
                return;
            }
            toast.success("Booking successfully deleted.")
            router.push('/bookings');
        } catch (error) {
            toast.error("Failed to delete booking", {
                description: "Service temporarily unavailable."
            });
            return;
        }
    }

    return <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button variant="destructive"><Trash2Icon size={16} />Delete Booking</Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Delete Booking</DialogTitle>
                <DialogDescription>Are you sure you want to delete this booking? This action is irreversible.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-row justify-end gap-2">
                <DialogClose asChild>
                    <Button className="max-w-fit" variant="outline">Cancel</Button>
                </DialogClose>
                <Button className="max-w-fit"
                    onClick={deleteHandler}
                    variant="destructive"
                    disabled={loading}
                    type="submit">{loading ? "Deleting..." : "Delete"}</Button>
            </div>
        </DialogContent>
    </Dialog>
}