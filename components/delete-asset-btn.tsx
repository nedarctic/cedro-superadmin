import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TrashIcon } from "lucide-react";

export function DeleteAssetBtn({ label, deleteHandler }: { label: string; deleteHandler?: () => void }) {
  return (
    <Dialog>
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
            <Button className="max-w-fit" variant="destructive" type="submit">Delete</Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
