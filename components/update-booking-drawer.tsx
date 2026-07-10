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

export function UpdateBookingDrawer({ booking }: { booking: Booking }) {
    const router = useRouter();
    const [name, setName] = useState<string>(booking.name);
    const [email, setEmail] = useState<string>(booking.email);
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    const updateHandler = async (e: SubmitEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const url = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/destinations/${booking.tour.destinationId}/tours/${booking.tourId}/bookings/${booking.id}`;

            const res = await fetch(url, {
                method: 'PATCH',
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
                            </Field>
                            <Field>
                                <FieldLabel>Email</FieldLabel>
                                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} />
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