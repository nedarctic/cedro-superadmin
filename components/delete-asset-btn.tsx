'use client'

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export function DeleteAssetBtn({ label, deleteHandler }: { label: string; deleteHandler: () => Promise<any> }) {

  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(true);

  const onDeleteHandler = async () => {
    setLoading(true);
    const { success, data, error } = await deleteHandler();
    if (!success) {
      toast.error("An error occurred", {
        description: error.error.message
      });
      setOpen(false);
      setLoading(false);
    } else {
      setOpen(false);
      setLoading(false);
      toast.success('Delete successful!')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive"><TrashIcon size={16} />{label}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete? This action is irreversible.
          </DialogDescription>
          <div className="flex flex-row justify-end gap-2">
            <DialogClose asChild>
              <Button className="max-w-fit" variant="outline">Cancel</Button>
            </DialogClose>
            <Button className="max-w-fit"
              onClick={onDeleteHandler}
              variant="destructive"
              disabled={loading}
              type="submit">{loading? "Deleting..." : "Delete"}</Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
