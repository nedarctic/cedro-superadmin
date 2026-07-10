'use client'

import { Tour } from "@/lib/types/tour";
import { useRouter } from "next/navigation";
import { SubmitEvent, useState, Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import z from "zod";
import { Button } from "./ui/button";
import { Field, FieldGroup, FieldLabel } from "./ui/field";
import { Form } from "./ui/form";
import { Input } from "./ui/input";
import Image from "next/image";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { Destination } from "@/lib/types/destination";

const itinerarySchema = z.object({
    id: z.string().optional(),
    subtitle: z.string().min(1, "Subtitle is required"),
    activities: z.array(z.string().min(1, "Field cannot be empty")).min(1, "Provide at least one activity"),
    itineraryImageUrl: z.string().optional(),
    itineraryImage: z.instanceof(File)
        .optional()
        .refine(file => !file || file.size < 5 * 1024 * 1024, { message: "Max allowed file size is 5MB" })
        .refine(file => !file || ['image/png', 'image/jpeg'].includes(file.type), { message: "Only PNG and JPEG formats allowed" })
}).refine(data => data.itineraryImage || data.itineraryImageUrl, { message: "An itinerary image is required", path: ['itineraryImage'] });

const tourSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    dates: z.string().min(1, "Date is required"),
    duration: z.string().min(1, "Duration is required"),
    groupSize: z.string().min(1, "Group size is required").trim().transform(Number).pipe(z.number().positive().max(100, "Group size cannot exceed 100")).transform(String),
    price: z.string().min(1, "Price is required").trim().transform(Number).pipe(z.number().positive()).transform(String),
    activities: z.array(z.string().min(1, "Field cannot be empty")).min(1, "At least one activity is required"),
    included: z.array(z.string().min(1, "Field cannot be empty")).min(1, "At least one included item is required"),
    excluded: z.array(z.string().min(1, "Field cannot be empty")).min(1, "At least one excluded item is required"),
    itineraries: z.array(itinerarySchema).min(1, "Provide at least one itinerary"),
    tourImage: z.instanceof(File)
        .optional()
        .refine(file => !file || file.size < 5 * 1024 * 1024, { message: "Max allowed file size is 5MB" })
        .refine(file => !file || ['image/png', 'image/jpeg'].includes(file.type), { message: "Only PNG and JPEG formats allowed" })
}).refine(data => data);

export function UpdateTourTestForm({ tour, destinations }: { tour: Tour; destinations: Destination[] }) {
    const router = useRouter();
    const [title, setTitle] = useState<string>(tour.title);
    const [description, setDescription] = useState<string>(tour.description);
    const [dates, setDates] = useState<string>(tour.dates);
    const [duration, setDuration] = useState<string>(tour.duration);
    const [groupSize, setGroupSize] = useState<string>(tour.groupSize);
    const [price, setPrice] = useState<string>(tour.price);
    const [tourImage, setTourImage] = useState<File | null>();
    const [activities, setActivities] = useState<string[]>(tour.activities);
    const [included, setIncluded] = useState<string[]>(tour.included);
    const [excluded, setExcluded] = useState<string[]>(tour.excluded);
    const [itineraries, setItineraries] = useState<{
        id?: string;
        subtitle: string;
        activities: string[];
        itineraryImage?: File | null;
        itineraryImageUrl?: string;
    }[]>(tour.itineraries.map(({ id, subtitle, activities, itineraryImageUrl }) => ({
        id,
        subtitle,
        activities,
        itineraryImageUrl,
    })));

    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(false);

    const addField = (setter: Dispatch<SetStateAction<string[]>>) => {
        setter(prev => [...prev, ''])
    }

    const removeField = (
        setter: Dispatch<SetStateAction<string[]>>,
        index: number
    ) => {
        setter(prev => [...prev].filter((_, i) => i !== index))
    }

    const onSubmitHandler = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setLoading(true);

            // 1. Validation
            const validationResult = tourSchema.safeParse({
                title,
                description,
                dates,
                duration,
                groupSize,
                price,
                tourImage,
                activities,
                included,
                excluded,
                itineraries
            });

            if (!validationResult.success) {
                setErrors(z.treeifyError(validationResult.error));
                setLoading(false);
                toast.error('A validation error occurred');
                return;
            }

            // 2. Construct data
            const formData = new FormData();

            tourImage && tourImage.size > 0 && formData.append('tourImage', tourImage);
            formData.append('tour', JSON.stringify({
                title,
                description,
                dates,
                duration,
                groupSize,
                price,
                activities,
                included,
                excluded,
            }));

            const updatedItinerariesRels: string[] = [];
            const updatedItineraries = itineraries.filter(({ itineraryImageUrl }) => itineraryImageUrl !== undefined);
            updatedItineraries.forEach(({ id, itineraryImage }) => itineraryImage && itineraryImage.size > 0 && updatedItinerariesRels.push(id!));
            const updatedItinerariesWithImages = updatedItineraries.filter(({ itineraryImage }, index) => {
                return itineraryImage && itineraryImage.size > 0
            });

            const updatedItinerariesImages = updatedItinerariesWithImages.map(({ itineraryImage }) => itineraryImage);

            const updatedItinerariesWithoutImages = updatedItineraries.map(({ itineraryImage, ...updatedItinerary }) => updatedItinerary);
            updatedItinerariesImages.length > 0 && updatedItinerariesImages.map(image => formData.append('updatedItinerariesImages', image as File))
            const updated = updatedItinerariesWithoutImages.map(({itineraryImageUrl, ...updatedItinerary}) => ({...updatedItinerary}))
            
            updated.length && formData.append('updatedItineraries', JSON.stringify(updated))
            updatedItinerariesRels.length && formData.append('updatedItinerariesRels', JSON.stringify({ updatedItinerariesRels }));


            const newItinerariesImages = itineraries.filter(({ itineraryImageUrl }) => itineraryImageUrl === undefined).map(({ itineraryImage }) => itineraryImage as File);
            newItinerariesImages.length && newItinerariesImages.map(image => formData.append('newItinerariesImages', image))
            const newItineraries = itineraries.filter(({ itineraryImageUrl }) => itineraryImageUrl === undefined)
                .map(({ itineraryImage, itineraryImageUrl, ...itinerary }) => itinerary);;
            newItineraries.length && formData.append('newItineraries', JSON.stringify(newItineraries));

            for (const [key, value] of formData.entries()) {
                console.log('key', key);
                console.log('value', value)
            }

            // 3. Send the request
            const res = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/destinations/${tour.destinationId}/tours/${tour.id}`, {
                method: 'PATCH',
                body: formData
            })

            if (!res.ok) {
                setLoading(false);
                toast.error('An error occurred', { description: await res.text() });                
                return;
            }

            const { data, success, error } = await res.json();

            if (!success) {    
                setLoading(false);            
                toast.error('Update failed');
                console.log('success', success);
                console.log('error', error)
                
                return;
            }

            setLoading(false);
            toast.success('Tour successfully updated');
            setErrors({});
            

            // 4. Navigate client to tour detail page
            router.push(`/tours/${tour.id}`);
        } catch (error) {
            setLoading(false);
            toast.error('An error occurred', {
                description: error instanceof Error && error.message || 'Service temporarily unavailable'
            });            
        }
    }

    return <Form className="flex flex-col w-full gap-4" onSubmit={onSubmitHandler}>
        <div className="flex flex-col gap-2">
            <Field className="flex flex-col gap-1">
                <FieldLabel>Title</FieldLabel>
                <Input value={title} onChange={e => setTitle(e.target.value)} />
                {errors?.properties?.title?.errors?.length &&
                    <ul className="pl-4 list-disc">{errors.properties.title.errors.map((error: string, index: number) =>
                        <li key={index} className="text-red-500 text-sm font-bold">{error}</li>)}</ul>}
            </Field>
            <Field className="flex flex-col gap-1">
                <FieldLabel>Description</FieldLabel>
                <Input value={description} onChange={e => setDescription(e.target.value)} />
                {errors?.properties?.description?.errors?.length &&
                    <ul className="pl-4 list-disc">{errors.properties.description.errors.map((error: string, index: number) =>
                        <li key={index} className="text-red-500 text-sm font-bold">{error}</li>)}</ul>}
            </Field>
            <Field className="flex flex-col gap-1">
                <FieldLabel>Dates</FieldLabel>
                <Input value={dates} onChange={e => setDates(e.target.value)} />
                {errors?.properties?.dates?.errors?.length &&
                    <ul className="pl-4 list-disc">{errors.properties.dates.errors.map((error: string, index: number) =>
                        <li key={index} className="text-red-500 text-sm font-bold">{error}</li>)}</ul>}
            </Field>
            <Field className="flex flex-col gap-1">
                <FieldLabel>Duration</FieldLabel>
                <Input value={duration} onChange={e => setDuration(e.target.value)} />
                {errors?.properties?.duration?.errors?.length &&
                    <ul className="pl-4 list-disc">{errors.properties.duration.errors.map((error: string, index: number) =>
                        <li key={index} className="text-red-500 text-sm font-bold">{error}</li>)}</ul>}
            </Field>
            <Field className="flex flex-col gap-1">
                <FieldLabel>Group size</FieldLabel>
                <Input value={groupSize} onChange={e => setGroupSize(e.target.value)} />
                {errors?.properties?.groupSize?.errors?.length &&
                    <ul className="pl-4 list-disc">{errors.properties.groupSize.errors.map((error: string, index: number) =>
                        <li key={index} className="text-red-500 text-sm font-bold">{error}</li>)}</ul>}
            </Field>
            <Field className="flex flex-col gap-1">
                <FieldLabel>Price</FieldLabel>
                <Input value={price} onChange={e => setPrice(e.target.value)} />
                {errors?.properties?.price?.errors?.length &&
                    <ul className="pl-4 list-disc">{errors.properties.price.errors.map((error: string, index: number) =>
                        <li key={index} className="text-red-500 text-sm font-bold">{error}</li>)}</ul>}
            </Field>
            <Field className="flex flex-col gap-1">
                <FieldLabel>Tour image</FieldLabel>
                <div className="aspect-video max-w-7xl relative my-2">
                    <Image src={tour.tourImageUrl} alt={"Tour image"} fill unoptimized className="rounded-2xl" />
                </div>
                <Input type="file" onChange={e => setTourImage(e.target.files && e.target.files[0])} />
                {errors?.properties?.tourImage?.errors?.length &&
                    <ul className="pl-4 list-disc">{errors.properties.tourImage.errors.map((error: string, index: number) =>
                        <li key={index} className="text-red-500 text-sm font-bold">{error}</li>)}</ul>}
            </Field>

            {/* activities */}
            <FieldGroup className="flex flex-col gap-2">

                <FieldLabel className="font-semibold text-md">Activities</FieldLabel>

                {activities.map((activity, index) =>
                    <div key={index} className="flex flex-col gap-2">
                        <div className="flex flex-row gap-2 justify-between">
                            <Input value={activity} onChange={(e) => setActivities(prev => {
                                const copy = [...prev];
                                copy[index] = e.target.value;
                                return copy;
                            })} />
                            <Button
                                onClick={() => {
                                    removeField(setActivities, index)
                                }}
                                disabled={activities.length === 1}
                                className="max-w-fit"
                                type="button"
                                variant="destructive"><Trash2Icon size={16} />Remove item</Button>
                        </div>
                        {errors?.properties?.activities?.items?.[index]?.errors?.length &&
                            <ul className="pl-4 list-disc">{errors.properties.activities.items[index].errors.map((error: string, index: number) =>
                                <li key={index} className="text-red-500 text-sm font-bold">{error}</li>)}</ul>}
                    </div>
                )}
                <Button onClick={() => addField(setActivities)} type="button" variant="default"><PlusIcon size={16} />Add item</Button>
            </FieldGroup>

            {/* included */}
            <FieldGroup className="flex flex-col gap-2">

                <FieldLabel className="font-semibold text-md">Included</FieldLabel>

                {included.map((item, index) =>
                    <div key={index} className="flex flex-col gap-1">
                        <div className="flex flex-row gap-2 justify-between">
                            <Input value={item} onChange={(e) => setIncluded(prev => {
                                const copy = [...prev];
                                copy[index] = e.target.value;
                                return copy;
                            })} />
                            <Button
                                className="max-w-fit"
                                type="button"
                                onClick={() => removeField(setIncluded, index)}
                                disabled={included.length === 1}
                                variant="destructive"><Trash2Icon size={16} />Remove item</Button>
                        </div>
                        {errors?.properties?.included?.items?.[index]?.errors?.length &&
                            <ul className="pl-4 list-disc">{errors.properties.included.items[index].errors.map((error: string, index: number) =>
                                <li key={index} className="text-red-500 text-sm font-bold">{error}</li>)}</ul>}
                    </div>
                )}
                <Button onClick={() => addField(setIncluded)} type="button" variant="default"><PlusIcon size={16} />Add item</Button>
            </FieldGroup>

            {/* excluded */}
            <FieldGroup className="flex flex-col gap-2">

                <FieldLabel className="font-semibold text-md">Excluded</FieldLabel>

                {excluded.map((item, index) =>
                    <div key={index} className="flex flex-col gap-1">
                        <div className="flex flex-row gap-2 justify-between">
                            <Input value={item} onChange={(e) => setExcluded(prev => {
                                const copy = [...prev];
                                copy[index] = e.target.value;
                                return copy;
                            })} />
                            <Button
                                disabled={excluded.length === 1}
                                onClick={() => removeField(setExcluded, index)}
                                className="max-w-fit"
                                type="button"
                                variant="destructive"><Trash2Icon size={16} />Remove item</Button>
                        </div>
                        {errors?.properties?.excluded?.items?.[index]?.errors?.length &&
                            <ul className="pl-4 list-disc">{errors.properties.excluded.items[index].errors.map((error: string, index: number) =>
                                <li key={index} className="text-red-500 text-sm font-bold">{error}</li>)}</ul>}
                    </div>
                )}
                <Button
                    onClick={() => addField(setExcluded)}
                    type="button"
                    variant="default"><PlusIcon size={16} />Add item</Button>
            </FieldGroup>

            {/* itineraries */}
            <FieldGroup className="flex flex-col">
                <FieldLabel className="font-semibold text-md">Itineraries</FieldLabel>
                {itineraries.map((itinerary, itineraryIndex) =>
                    <div key={itineraryIndex} className="flex flex-col gap-2 rounded-2xl p-4 border-2">

                        <div className="flex flex-row justify-between">
                            <p className="p-2 rounded-lg bg-green-600 text-sm text-black font-bold w-fit">Day {itineraryIndex + 1}</p>
                            <Button type="button" variant="destructive" 
                            className="max-w-fit"
                            onClick={() => {
                                setItineraries(prev => [...prev].filter((_, i) => i !== itineraryIndex))
                            }} 
                            disabled={itineraries.length === 1}><Trash2Icon size={16} />Delete</Button>
                        </div>
                        <Field className="flex flex-col gap-2">
                            <FieldLabel>Subtitle</FieldLabel>
                            <Input value={itinerary.subtitle} onChange={(e) => setItineraries(prev => {
                                const copy = [...prev];
                                copy[itineraryIndex].subtitle = e.target.value;
                                return copy;
                            })} />
                            {errors?.properties?.itineraries?.items?.[itineraryIndex]?.properties?.subtitle?.errors?.length &&
                                <ul className="pl-4 list-disc">{errors.properties.itineraries.items[itineraryIndex].properties.
                                    subtitle.errors.map((error: string, index: number) =>
                                        <li key={index} className="text-red-600 font-bold text-sm">{error}</li>)}</ul>
                            }
                        </Field>

                        {itinerary.itineraryImageUrl &&
                            <div className="relative aspect-video max-w-7xl">
                                <Image
                                    fill
                                    className="rounded-2xl object-cover object-top"
                                    unoptimized
                                    src={itinerary.itineraryImageUrl!}
                                    alt={`Day ${itineraryIndex + 1} itinerary image`} />
                            </div>
                        }

                        <FieldGroup className="flex flex-col gap-2">
                            <FieldLabel>Itinerary activities</FieldLabel>

                            {itinerary.activities.map((activity, activityIndex) =>
                                <div key={activityIndex} className="flex flex-col gap-1">
                                    <div className="flex flex-row justify-between gap-4">
                                        <Input key={activityIndex} value={activity} onChange={(e) => {
                                            setItineraries(prev => {
                                                const copy = [...prev];
                                                copy[itineraryIndex].activities = [...copy[itineraryIndex].activities];
                                                copy[itineraryIndex].activities[activityIndex] = e.target.value;
                                                return copy;
                                            })
                                        }} />
                                        <Button className="max-w-fit"
                                            onClick={() => setItineraries(prev => {
                                                const copy = [...prev];
                                                copy[itineraryIndex] = { ...copy[itineraryIndex], activities: [...copy[itineraryIndex].activities.filter((_, i) => i !== activityIndex)] };
                                                return copy;
                                            })}
                                            variant="destructive">Remove item</Button>
                                    </div>
                                    {errors?.properties?.itineraries?.items?.[itineraryIndex]?.properties?.activities?.items?.[activityIndex]?.errors?.length &&
                                        <ul className="pl-4 list-disc">{errors.properties.itineraries.items[itineraryIndex].properties.activities.items[activityIndex].errors.map((error: string, index: number) => <li key={index} className="text-red-600 font-bold text-sm">{error}</li>)}</ul>
                                    }
                                </div>
                            )}
                            <Button onClick={() => setItineraries(prev => {
                                const copy = [...prev];
                                copy[itineraryIndex] = { ...copy[itineraryIndex], activities: [...copy[itineraryIndex].activities, ''] };
                                return copy;
                            })}
                                type="button" variant="default"><PlusIcon size={16} />Add item</Button>
                        </FieldGroup>

                        <Field className="flex flex-col gap-1">
                            <FieldLabel>Itinerary image</FieldLabel>
                            <Input
                                accept="image/png, image/jpeg"
                                type="file"
                                onChange={(e) => setItineraries(prev => {
                                    const copy = [...prev];
                                    copy[itineraryIndex].itineraryImage = e.target.files ? e.target.files[0] : null;
                                    return copy;
                                })} />
                            {errors?.properties?.itineraries?.items?.[itineraryIndex]?.properties?.itineraryImage?.errors?.length &&
                                <ul className="pl-4 list-disc">{errors.properties.itineraries.items[itineraryIndex].properties.itineraryImage.errors.map((error: string, index: number) =>
                                    <li key={index} className="text-red-500 text-sm font-bold">{error}</li>)}</ul>}
                        </Field>
                    </div>
                )}
            </FieldGroup>
        </div >
        <Button type="button"
            onClick={(e) => {
                setItineraries(prev => [...prev, {
                    subtitle: '',
                    activities: ['']
                }])
            }}
            variant="secondary"><PlusIcon size={16} />Add itinerary</Button>
        <Button disabled={loading} type="submit">Submit</Button>
    </Form >
}