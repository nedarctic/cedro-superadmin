'use client'

import { Trash2Icon } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, 
    DialogClose, 
    DialogContent, 
    DialogDescription, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger 
} from "./ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function DeleteBlogBtn ({blogId}: {blogId: string}) {
    const router = useRouter();
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const deleteHandler = async () => {
        try {
            setLoading(true);

            const url = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/blogs/${blogId}`
            const res = await fetch(url, {
                method: "DELETE"
            });

            const {success, data, error} = await res.json();
            
            if(!res.ok || !success){
                setLoading(false);
                setOpen(false);
                toast.error("Delete blog failed");
                console.log("Error deleting blog", error);
                return;
            };

            setLoading(false);
            setOpen(false);
            toast.success("Blog deleted succsesfully");
            router.push('/blogs');

        } catch (error) {
            toast.error("Service temporarily unavailable.")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive"><Trash2Icon size={16} />Delete blog</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Blog</DialogTitle>
                </DialogHeader>
                <DialogDescription>Are you sure you want to delete this blog? This action is irreversible.</DialogDescription>
                <div className="flex flex-row justify-end gap-4">
                    <DialogClose asChild>
                        <Button>Cancel</Button>
                    </DialogClose>
                    <Button 
                    onClick={deleteHandler}
                    disabled={loading}
                    variant="destructive"><Trash2Icon size={16} />{loading ? "Deleting..." : "Delete"}</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}