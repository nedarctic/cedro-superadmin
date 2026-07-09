'use client';

import { toast } from "sonner";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTrigger,
    DialogTitle,
    DialogDescription
} from "./ui/dialog";
import { useState } from "react";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export function DeleteTourBtn({ tourId, destinationId }: { tourId: string, destinationId: string }) {

    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    const deleteHandler = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/destinations/${destinationId}/tours/${tourId}`, {
                method: 'DELETE',
            });
            const { success } = await res.json()
            setLoading(false);
            setOpen(false);
            
            success ? toast.success('Tour deleted successfully') : toast.error("An error occurred");
            router.push('/tours');
        } catch (error) {
            setLoading(false);
            setOpen(false);
            toast.error("Failed to delete the tour", {
                description: String(error)
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive"><TrashIcon size={16} />Delete tour</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogTitle>Delete Tour</DialogTitle>
                <DialogHeader>
                    <DialogDescription>Are you sure you want to delete this tour? This action is irreversible.</DialogDescription>
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
    );
}