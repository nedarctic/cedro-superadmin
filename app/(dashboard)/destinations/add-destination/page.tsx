"use client"

import { BreadCrumb } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation"
import { SubmitEvent, useState } from "react";
import { toast } from "sonner";
import z from "zod";

const destinationSchema = z.object({
    name: z.string().trim().min(1, "Name is required"),
    destinationImage: z.instanceof(File)
        .refine(file => file.size < 5 * 1024 * 1024, { message: "Maximum allowed file size is 5MB" })
        .refine(file => ["image/png", "image/jpeg", "image/gif"].includes(file.type), { message: "Allowed file types are PNG and JPEG only." }),
    guides: z.array(z.object({
        subtitle: z.string().trim().min(1, "Subtitle cannot be empty"),
        content: z.string().trim().min(1, "Content cannot be empty")
    })).min(1, "At least one paragraph is needed")
});

export default function AddDestinationPage() {

    const router = useRouter();

    const [name, setName] = useState<string>("");
    const [guides, setGuides] = useState<{ subtitle: string; content: string; position?: number }[]>([{
        subtitle: "",
        content: ""
    }]);
    const [destinationImage, setDestinationImage] = useState<File>();

    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<any>({});

    const submitHandler = async (e: SubmitEvent) => {
        e.preventDefault();

        try {
            setLoading(true);

            const validationRes = destinationSchema.safeParse({
                name,
                guides,
                destinationImage
            });

            if (!validationRes.success) {
                setLoading(false);
                setErrors(z.treeifyError(validationRes.error));
                return;
            }

            const guidesData = guides.map((guide, index) => ({...guide, position: (index + 1)}))
            guidesData.map(guide => console.log("guide", guide));

            const formData = new FormData();
            formData.append("name", name);
            destinationImage && formData.append("image", destinationImage);
            formData.append("guides", JSON.stringify({ guides: guidesData }));

            const url = "/api/destinations";

            const res = await fetch(url, {
                method: "POST",
                body: formData
            });

            console.log("create destination res", res);

            console.log("formdata");
            for(const [key, value] of formData.entries()){
                console.log("key", key, "value", value);
            }

            const { data, error, success } = await res.json();

            if (!res.ok || !success) {
                setLoading(false);
                toast.error("Failed to add destination");
                return;
            }

            setLoading(false);
            toast.success("Destination added successfully.")
            router.push("/destinations");

        } catch (error) {
            setLoading(false);
            toast.error("Service temporarily unavailable. Please try again later.")
        }
    }

    const crumbs = [
        { label: "Destinations", link: "/destinations" }
    ]

    return <div className="flex flex-col gap-6 min-h-screen">
        <BreadCrumb crumbs={crumbs} currentPage="Add Destination" />

        <Form className="flex flex-col gap-4" onSubmit={submitHandler} id="add-destination-form">
            <Field>
                <FieldLabel>Name</FieldLabel>
                <Input type="text" onChange={e => setName(e.target.value)} />
            </Field>
            <Field>
                <FieldLabel>Destination Image</FieldLabel>
                <Input type="file" accept="image/png, image/jpeg, image/gif" onChange={e => {
                    const file = e.currentTarget.files![0]
                    setDestinationImage(file)
                }} />
            </Field>
            <h1 className="font-medium text-lg">Guides</h1>
            {guides && guides.map((guide, index) => <div className="flex flex-col gap-3" key={index}>
                <div className="flex flex-row justify-between">
                    <p className="text-white bg-green-600 px-2 py-1 rounded-md">Guide {index + 1}</p>
                    <Button variant="destructive" disabled={guides.length === 1}
                        onClick={() => setGuides(prev => [...prev].filter((_, i) => i !== index))}><Trash2Icon size={16} />Remove paragraph</Button>
                </div>
                <Field>
                    <FieldLabel>Subtitle</FieldLabel>
                    <Input type="text" onChange={e => setGuides(prev => {
                        const copy = [...prev];
                        copy[index].subtitle = e.target.value;
                        return copy;
                    })} />
                </Field>
                <Field>
                    <FieldLabel>Content</FieldLabel>
                    <Textarea onChange={e => setGuides(prev => {
                        const copy = [...prev];
                        copy[index].content = e.target.value;
                        return copy;
                    })} />
                </Field>
            </div>
            )}
            <Button type="button" onClick={() => setGuides(prev => [...prev, { content: "", subtitle: "" }])}><PlusIcon size={16} />Add paragraph</Button>
        </Form>

        <Button type="submit" form="add-destination-form">{loading ? <Spinner size={8} /> : "Add destination"}</Button>
    </div>
}