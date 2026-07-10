'use state'

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
    DialogFooter,
    DialogClose
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Trash2Icon } from "lucide-react";

export function DeleteMemberBtn({ memberId }: { memberId: string }) {

    const router = useRouter();

    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    const deleteHandler = async () => {

        try {
            setLoading(true);
            const url = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/team/${memberId}`;
            const res = await fetch(url, {
                method: "DELETE"
            });
            const { data, success, error } = await res.json();

            if (!res.ok || !success) {
                setLoading(false);
                setOpen(false);
                toast.error("Failed to delete member", {
                    description: error || 'An error occurred'
                });
                return;
            }

            setLoading(false);
            setOpen(false);
            router.refresh();

        } catch (error) {
            toast.error('Service temporarily unavailable')
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive"><Trash2Icon size={16} />Delete Member</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Member</DialogTitle>
                </DialogHeader>

                <DialogDescription>Are you sure you want to remove this member from the team? This action cannot be undone.</DialogDescription>
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
    )
}