'use client'

import { Booking } from "@/lib/types/booking";
import { PencilIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, SubmitEvent } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerPopup,
    DrawerTitle,
    DrawerTrigger
} from "./ui/drawer";
import { Field, FieldLabel } from "./ui/field";
import { Form } from "./ui/form";
import { Input } from "./ui/input";
import z from "zod";

const updateBookingSchema = z.object({
    name: z.string().trim().min(1, "Name is required"),
    email: z.email("Invalid email")
})

export function UpdateBookingDrawer({ booking }: { booking: Booking }) {
    const router = useRouter();
    const [name, setName] = useState<string>(booking.name);
    const [email, setEmail] = useState<string>(booking.email);
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [errors, setErrors] = useState<any>({})

    const updateHandler = async (e: SubmitEvent) => {
        e.preventDefault();
        try {
            setLoading(true);

            const validationRes = updateBookingSchema.safeParse({
                name,
                email
            });

            if(!validationRes.success){
                setLoading(false);
                setErrors(z.treeifyError(validationRes.error));
                return;
            }

            const url = `/api/bookings/${booking.id}`;

            const res = await fetch(url, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email })
            });


            const { success, data, error } = await res.json();

            if (!res.ok || !success) {
                setLoading(false);
                setOpen(false);
                toast.error("Update failed.", {
                    description: String(error)
                });
                return;
            };

            setLoading(false);
            setOpen(false);

            toast.success("Booking update successful");
            router.refresh();

        } catch (error) {
            setLoading(false);
            setOpen(false);

            toast.error("Service temporarily unavailable.")
            return;
        }
    }

    return (
        <Drawer position="right" open={open} onOpenChange={setOpen}>
            <DrawerTrigger render={<Button variant={"default"} />}>
                <PencilIcon size={16} />Edit Booking
            </DrawerTrigger>
            <DrawerPopup className="p-6 h-full" variant="inset">
                <DrawerHeader className="pl-0">
                    <DrawerTitle>Edit Booking</DrawerTitle>
                </DrawerHeader>
                <DrawerContent className="h-full">
                    <Form onSubmit={updateHandler} className="flex flex-col justify-between gap-4 h-full">

                        <div className="flex flex-col gap-4">
                            <Field>
                                <FieldLabel>Name</FieldLabel>
                                <Input type="text" value={name} onChange={e => setName(e.target.value)} />
                                {errors?.properties?.name?.errors?.length && <ul className="pl-4 list-disc">{errors.properties.name.errors.map((error: string, index: number) => 
                                <li key={index} className="font-bold text-xs text-red-600">{error}</li>)}</ul>}
                            </Field>
                            <Field>
                                <FieldLabel>Email</FieldLabel>
                                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} />
                                {errors?.properties?.email?.errors?.length && <ul className="pl-4 list-disc">{errors.properties.email.errors.map((error: string, index: number) => 
                                <li key={index} className="font-bold text-xs text-red-600">{error}</li>)}</ul>}
                            </Field>
                        </div>
                        <div className="flex flex-row justify-end gap-4">
                            <DrawerClose render={<Button variant="outline" />}>Cancel</DrawerClose>
                            <Button type="submit" variant={"default"}
                                disabled={loading}>{loading ? "Updating..." : "Update"}</Button>
                        </div>
                    </Form>
                </DrawerContent>
            </DrawerPopup>
        </Drawer>
    );
}