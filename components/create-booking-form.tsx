'use client'

import { Destination } from "@/lib/types/destination";
import { Field, FieldLabel } from "./ui/field";
import { Select, SelectTrigger, SelectGroup, SelectItem, SelectValue, SelectContent } from "./ui/select";
import { useRouter } from "next/navigation";
import { useState, SubmitEvent } from "react";
import { Form } from "./ui/form";
import { Input } from "./ui/input";
import z from "zod";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { CustomSpinner } from "./custom-spinner";
import { Button } from "./ui/button";
import { Tour } from "@/lib/types/tour";
import { toast } from "sonner";

const createBookingSchema = z.object({
    name: z.string().trim().min(1, 'Name cannot be empty'),
    email: z.email({ message: 'Invalid email' }),
    destinationId: z.string().trim().min(1, "You need to choose a destination"),
    tourId: z.string().trim().min(1, "You need to choose a tour")
});

export function CreateBookingForm({ destinations, tours }: { destinations: Destination[], tours: Tour[] }) {
    const router = useRouter();

    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    const [selectedTours, setSelectedTours] = useState<Tour[] | null>();

    const [destinationId, setDestinationId] = useState<string>('');
    const [tourId, setTourId] = useState<string>('');

    const [errors, setErrors] = useState<any>();
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {

        e.preventDefault();
        try {
            setLoading(true);

            const parsedData = createBookingSchema.safeParse({ name, email, destinationId, tourId });

            if (!parsedData.success) {
                console.log('validation error', parsedData.error.message)
                setErrors(z.treeifyError(parsedData.error))
                setLoading(false);
                return;
            } else {
                setErrors({});
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/destinations/${destinationId}/tours/${tourId}/bookings`, {
                method: 'POST',
                body: JSON.stringify({ name, email })
            });

            const { data, success, error } = await res.json();

            if (!success) {
                toast.error('Failed to create the booking.', {
                    description: "An error occurred"
                });
                console.log('failed to book tour', error);
                setLoading(false);
                return;
            }

            console.log('booking result data', data)
            toast.success('Booking created successfully');
            setLoading(false);
            router.push('/bookings');

        } catch (error) {
            setLoading(false);
            console.log('an error occurred', error)
        }
    }

    return (
        <Form onSubmit={handleSubmit} className="flex flex-col w-full max-w-7xl mx-auto space-y-4">
            <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input id="name" required type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
                {errors?.properties?.name?.errors?.length && <ul className="list-disc pl-4">{errors.properties.name.errors.map((error: string, index: number) => (<li className="font-bold text-[12px] text-red-600" key={index}>{error}</li>))}</ul>}
            </Field>
            <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input required id="email" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                {errors?.properties?.email?.errors?.length && <ul className="list-disc pl-4">{errors.properties.email.errors.map((error: string, index: number) => (<li className="font-bold text-[12px] text-red-600" key={index}>{error}</li>))}</ul>}
            </Field>

            <div className="flex justify-between gap-4 sm:flex-row flex-col">
                <Field className="flex-1">
                    <FieldLabel htmlFor='destination'>Destination</FieldLabel>
                    <Select required value={destinationId} onValueChange={value => {
                        setDestinationId(value);
                        const filteredTours = tours.filter(tour => tour.destinationId === value)
                        setSelectedTours(filteredTours);
                        console.log('selected tours', filteredTours);
                        setTourId('');
                    }}>
                        <SelectTrigger id="destination" className="w-full">
                            <SelectValue placeholder='Select a destination' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {destinations.map(destination => (<SelectItem key={destination.id}
                                    value={destination.id}>{destination.name}</SelectItem>))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {errors?.properties?.destinationId?.errors?.length && <ul className="list-disc pl-4">{errors.properties.destinationId.errors.map((error: string, index: number) => (<li className="font-bold text-[12px] text-red-600" key={index}>{error}</li>))}</ul>}
                </Field>

                <Field className="flex-1">
                    <FieldLabel htmlFor='tour'>Tour</FieldLabel>
                    <Select required value={tourId} onValueChange={setTourId}>
                        <SelectTrigger id="tour" className="w-full">
                            <SelectValue placeholder='Select a tour' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {selectedTours && selectedTours.map(tour => (<SelectItem key={tour.id} value={tour.id}>{tour.title}</SelectItem>))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {errors?.properties?.tourId?.errors?.length && <ul className="list-disc pl-4">{errors.properties.tourId.errors.map((error: string, index: number) => (<li className="font-bold text-[12px] text-red-600" key={index}>{error}</li>))}</ul>}
                </Field>
            </div>

            <Button type="submit" disabled={loading}>Create booking</Button>

            {loading && (
                <Dialog open={loading}>
                    <DialogContent
                        onInteractOutside={(e) => e.preventDefault()}
                        showCloseButton={false}
                        onEscapeKeyDown={(e) => e.preventDefault()}
                    >
                        <div className="flex flex-col items-center gap-4 py-6">
                            <p className="font-bold text-md">Creating booking</p><CustomSpinner />
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </Form>
    )
}