import { SubmitEvent, useState } from "react";
import { Form } from "./ui/form";
import { Field, FieldGroup, FieldLabel, FieldDescription, FieldError } from "./ui/field";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";
import z from "zod";

type StorySection = {
    section: string;
    subtitle: string;
    content: string;
    image: File | null;
};

const initialBlogData = (section: number) => ({ section: `Section ${section}`, subtitle: "", content: "", image: null })

const storySectionSchema = z.object({
    section: z.string().trim().min(1, "Section cannot be empty"),
    subtitle: z.string().trim().min(1, "Subtitle cannot be empty"),
    content: z.string().trim().min(1, "Content cannot be empty"),
    image: z.instanceof(File, { message: "Please upload an image file" })
        .refine(file => file.size <= 5 * 1024 * 1024, { message: "Image size must be less than 5MB" })
        .refine(file => ['image/jpeg', 'image/png', 'image/gif'].includes(file.type), { message: "Only JPEG, PNG, and GIF images are allowed" })
});

const BlogCreationSchema = z.object({
    title: z.string().trim().min(1, "Title cannot be empty"),
    intro: z.string().trim().min(1, "Introduction cannot be empty"),
    conclusion: z.string().trim().min(1, "Conclusion cannot be empty"),
    storySections: z.array(storySectionSchema).min(1, "At least one story section is required")
});

export function CreateBlogForm() {

    const [title, setTitle] = useState<string>("");
    const [intro, setIntro] = useState<string>("");
    const [conclusion, setConclusion] = useState<string>("");
    const [storySections, setStorySections] = useState<StorySection[]>([initialBlogData(1)]);

    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(false);

    const addStorySection = (section: number) => {
        return setStorySections(prev => [...prev, initialBlogData(section)])
    }

    const handleBlogSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);
        const validationResult = BlogCreationSchema.safeParse({ title, intro, conclusion, storySections });
        setLoading(false);
        if (!validationResult.success) {
            setErrors(z.treeifyError(validationResult.error));
            return;
        }
    }

    return (
        <Form onSubmit={handleBlogSubmit} className="flex flex-col gap-4 w-full mx-auto">
            <Field>
                <FieldLabel htmlFor="title">Blog Title</FieldLabel>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                {errors.properties?.title?.errors?.length && <ul className="list-disc pl-4">{errors.properties.title.errors.map((error: string, index: number) => (<li className="font-bold text-[12px] text-red-600" key={index}>{error}</li>))}</ul>}
            </Field>
            <Field>
                <FieldLabel htmlFor="intro">Introduction</FieldLabel>
                <Textarea id="intro" value={intro} onChange={(e) => setIntro(e.target.value)} required />
                {errors.properties?.intro?.errors?.length && <ul className="list-disc pl-4">{errors.properties.intro.errors.map((error: string, index: number) => (<li className="font-bold text-[12px] text-red-600" key={index}>{error}</li>))}</ul>}
            </Field>
            

            <FieldGroup>
                <FieldDescription>Story Sections</FieldDescription>
                {storySections.map((section, index) => (
                    <div key={index} className="flex flex-col gap-2">
                        <div className="flex justify-between">
                            <p className="font-medium text-md bg-olive-700 px-2 rounded-md items-center flex text-white">Section {index + 1}</p>
                            <Button disabled={storySections.length === 1} type="button" variant="destructive" onClick={() => {
                                const newSections = [...storySections];
                                newSections.splice(index, 1);
                                setStorySections(newSections);
                            }}>Remove Section</Button>
                        </div>
                        <Field>
                            <FieldLabel htmlFor={`subtitle-${index}`}>Subtitle</FieldLabel>
                            <Input required id={`subtitle-${index}`} value={section.subtitle} onChange={(e) => {
                                const newSections = [...storySections];
                                newSections[index].subtitle = e.target.value;
                                setStorySections(newSections);
                            }} />
                            {errors.properties?.storySections?.items?.[index]?.properties?.subtitle?.errors?.length && <ul className="list-disc pl-4">{errors.properties.storySections.items[index].properties.subtitle.errors.map((error: string, index: number) => (<li className="font-bold text-[12px] text-red-600" key={index}>{error}</li>))}</ul>}
                        </Field>                        
                        
                        
                        <Field>
                            <FieldLabel htmlFor={`content-${index}`}>Content</FieldLabel>
                            <Textarea required id={`content-${index}`} value={section.content} onChange={(e) => {
                                const newSections = [...storySections];
                                newSections[index].content = e.target.value;
                                setStorySections(newSections);
                            }} />
                            {errors.properties?.storySections?.items?.[index]?.properties?.content?.errors?.length && <ul className="list-disc pl-4">{errors.properties.storySections.items[index].properties.content.errors.map((error: string, index: number) => (<li className="font-bold text-[12px] text-red-600" key={index}>{error}</li>))}</ul>}
                        </Field>
                        
                        <Field>
                            <FieldLabel htmlFor={`image-${index}`}>Image</FieldLabel>
                            <Input required type="file" id={`image-${index}`} onChange={(e) => {
                                const newSections = [...storySections];
                                newSections[index].image = e.target.files ? e.target.files[0] : null;
                                setStorySections(newSections);
                            }} />
                            {errors.properties?.storySections?.items?.[index]?.properties?.image?.errors?.length && <ul className="list-disc pl-4">{errors.properties.storySections.items[index].properties.image.errors.map((error: string, index: number) => (<li className="font-bold text-[12px] text-red-600" key={index}>{error}</li>))}</ul>}
                        </Field>
                    </div>
                ))}
                <div className="flex justify-start">
                    <Button type="button" onClick={() => addStorySection(storySections.length + 1)}>
                        <PlusIcon size={16} /> Add Section
                    </Button>
                </div>
            </FieldGroup>
            <Field>
                <FieldLabel htmlFor="conclusion">Conclusion</FieldLabel>
                <Textarea id="conclusion" value={conclusion} onChange={(e) => setConclusion(e.target.value)} required />
                {errors.properties?.conclusion?.errors?.length && <ul className="list-disc pl-4">{errors.properties.conclusion.errors.map((error: string, index: number) => (<li className="font-bold text-[12px] text-red-600" key={index}>{error}</li>))}</ul>}
            </Field>
            <Button disabled={loading} type="submit">
                {loading ? 'Creating...' : 'Create Blog'}
            </Button>
        </Form>
    )
}