"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogTrigger,
    DialogDescription,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

export function DeleteDestinationDialog ({destinationId}: {destinationId: string}) {
    
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    const clickHandler = async () => {
        try {
            setLoading(true);

            const url = `/api/destinations/${destinationId}`;
            const res = await fetch(url, {
                method: "DELETE"
            });

            if(!res.ok){
                toast.error("Failed to delete destination");
                setLoading(false);
                return;
            }

            setLoading(false);
            setOpen(false);
            toast.success("Successfully deleted destination");
            router.push("/destinations");
        } catch (error) {
            setLoading(false);
            toast.error("Service temporarily unavailable. Please try again later.")
        }
    }

    return <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button variant="destructive"><Trash2Icon size={16} />Delete Destination</Button>
        </DialogTrigger>

        <DialogContent>
            <DialogHeader>Delete destination</DialogHeader>
            <DialogDescription>This action cannot be undone.</DialogDescription>
            <DialogFooter className="flex flex-row gap-2 flex-end py-2 pr-2">
                <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button 
                onClick={() => clickHandler()}
                disabled={loading}
                variant="destructive">{loading ? <Spinner size={8}/> : "Delete"}</Button>
            </DialogFooter>
        </DialogContent>
        
    </Dialog>

}