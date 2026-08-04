"use client"

import { Destination } from "@/lib/types/destination";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { SubmitEvent, useState } from "react";
import { toast } from "sonner";
import z, { string } from "zod";
import { Button } from "./ui/button";
import { Field, FieldLabel } from "./ui/field";
import { Form } from "./ui/form";
import { Input } from "./ui/input";
import { Spinner } from "./ui/spinner";
import { Textarea } from "./ui/textarea";

const destinationSchema = z.object({
    name: z.string().optional(),
    destinationImage: z.instanceof(File)
        .optional()
        .refine(file => !file || file.size < 5 * 1024 * 1024, { message: "Maximum supported file size is 5MB" })
        .refine(file => !file || ["image/png", "image/jpeg", "image/gif"].includes(file.type), { message: "Supported file types are PNG and JPEG only." }),
    guides: z.array(z.object({
        subtitle: z.string().optional(),
        content: z.string().optional(),
    })).min(1, "At least one paragraph is needed.")
});

function uuidGen () {
    return crypto.randomUUID();
}

export function EditDestinationForm({ destination }: { destination: Destination }) {
    const router = useRouter();

    console.log("destination", destination);
    const [name, setName] = useState<string>(destination.name ? destination.name : "");
    const [guides, setGuides] = useState<{
        id: string;
        subtitle: string;
        content: string;
    }[]>(destination.guide && destination.guide.length ? destination.guide : [{
        id: uuidGen(),
        subtitle: "",
        content: ""
    }]);
    const [destinationImage, setDestinationImage] = useState<File>();

    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<any>({});

    const submitHandler = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setLoading(true);

            const validationRes = destinationSchema.safeParse({
                name,
                destinationImage,
                guides
            });

            if (!validationRes.success) {
                setLoading(false);
                setErrors(z.treeifyError(validationRes.error));
                toast.success("Form validation error");
                return;
            }

            const destinationGuides = guides.map((guide, index) => ({...guide, position: index }))

            const formData = new FormData();
            formData.append("name", name);
            destinationImage && formData.append("destinationImage", destinationImage);
            formData.append("guides", JSON.stringify({ guides: destinationGuides }));

            const url = `/api/destinations/${destination.id}`;
            const res = await fetch(url, {
                method: "PATCH",
                body: formData
            });

            const { success, data, error } = await res.json();
            if(!res.ok || !success){
                setLoading(false);
                toast.error("Failed to update the destination.");
                return;
            }

            setLoading(false);
            router.push(`/destinations/${destination.id}`)
        } catch (error) {
            setLoading(false);
            toast.error("Service temporarily unavailable. Please try again later.")
        }
    }

    return <div className="flex flex-col gap-10">
        <Form onSubmit={submitHandler} className="flex flex-col gap-4" id="edit-destination-form">
            <Field>
                <FieldLabel>Name</FieldLabel>
                <Input defaultValue={name} onChange={e => setName(e.target.value)} type="text" />
            </Field>
            <Field>
                <FieldLabel>Destination image</FieldLabel>
                <Input type="file" onChange={e => {
                    const file = e.target.files![0];
                    setDestinationImage(file);
                }} />
            </Field>
            <h1 className="font-bold text-md">Guides</h1>
            {guides && guides.map((guide, index) => <div className="flex flex-col gap-4" key={index}>
                <div className="flex flex-row justify-between">
                    <p className="px-2 py-1 bg-green-600 text-white rounded-md">Guide {index + 1}</p>
                    <Button 
                    disabled={guides.length === 1}
                    onClick={() => setGuides(prev => [...prev].filter((_, i) => i !== index))} 
                    variant="destructive"><Trash2Icon size={16} />Remove paragraph</Button>
                </div>
                <Field>
                    <FieldLabel>Subtitle</FieldLabel>
                    <Input type="text" defaultValue={guide.subtitle} onChange={e => setGuides(prev => {
                        const copy = [...prev];
                        copy[index].subtitle = e.target.value;
                        return copy;
                    })} />
                </Field>
                <Field>
                    <FieldLabel>Content</FieldLabel>
                    <Textarea defaultValue={guide.content} onChange={e => setGuides(prev => {
                        const copy = [...prev];
                        copy[index].content = e.target.value;
                        return copy;
                    })} />
                </Field>
            </div>)}
            <Button onClick={() => setGuides(prev => [...prev, {id: uuidGen(), subtitle: "", content: "" }])}
                type="button"
                variant="secondary"><PlusIcon size={16} />Add paragraph</Button>
        </Form>
        <Button form="edit-destination-form" type="submit">{loading ? <Spinner size={8} /> : "Submit"}</Button>
    </div>
}