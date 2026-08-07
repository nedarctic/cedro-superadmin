'use client'

import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { SubmitEvent, useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { CustomSpinner } from "./custom-spinner";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Form } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Blog } from "@/lib/types/blog";
import { StorySection } from "@/lib/types/story-section";

const initialBlogData = {
    id: crypto.randomUUID(),
    subtitle: "",
    content: "",
}

const storySectionSchema = z.object({
    subtitle: z.string().optional(),
    content: z.string().optional(),
});

const BlogUpdateSchema = z.object({
    title: z.string().optional(),
    intro: z.string().optional(),
    excerpt: z.string().optional(),
    conclusion: z.string().optional(),
    blogImage: z.instanceof(File)
    .nullable()
    .optional()
        .refine(file => !file || file.size > 0, { message: "Blog image is required" })
        .refine(file => !file || ['image/jpeg', 'image/png', 'image/gif'].includes(file.type), { message: "Only JPEG, PNG, and GIF images are allowed" })
        .refine(file => !file || file.size < 5 * 1024 * 1024, { message: "Maximum allowed file size is 5MB" }),
    storySections: z.array(storySectionSchema).min(1, "At least one story section is required")
});

export function UpdateBlogForm({blog}: {blog: Blog}) {

    const router = useRouter();

    const [title, setTitle] = useState<string>(blog.title);
    const [excerpt, setExcerpt] = useState<string>(blog.excerpt);
    const [intro, setIntro] = useState<string>(blog.story.intro);
    const [conclusion, setConclusion] = useState<string>(blog.story.conclusion);
    const [blogImage, setBlogImage] = useState<File | null>(null);
    const [storySections, setStorySections] = useState<Partial<StorySection>[]>(blog.story.sections);

    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(false);

    const addStorySection = () => {
        return setStorySections(prev => [...prev, initialBlogData])
    };

    const handleBlogSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setLoading(true);
            const validationResult = BlogUpdateSchema.safeParse({
                title,
                intro,
                excerpt,
                conclusion,
                blogImage,
                storySections
            });

            if (!validationResult.success) {
                setErrors(z.treeifyError(validationResult.error));
                setLoading(false);
                console.log("validation errors", z.treeifyError(validationResult.error));
                return;
            }

            // blog data
            const formData = new FormData();

            formData.append('blog',
                JSON.stringify({
                    title,
                    intro,
                    excerpt,
                    conclusion,
                    sections: storySections.map((section, index) => ({
                        id: section.id,
                        sectionNumber: index + 1,
                        subtitle: section.subtitle,
                        content: section.content
                    }))
                })
            );

            // blog image
            blogImage && blogImage.size > 0 && formData.append('image', blogImage as File);

            const res = await fetch(`/api/blogs/${blog.id}`, {
                method: 'PATCH',
                ...(blogImage && blogImage.size > 0 ? {} : {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }),
                body: blogImage && blogImage.size > 0 ? formData : JSON.stringify({
                    title,
                    intro,
                    excerpt,
                    conclusion,
                    sections: storySections.map((section, index) => ({
                        id: section.id,
                        sectionNumber: index + 1,
                        subtitle: section.subtitle,
                        content: section.content
                    }))
                })
            });

            const { data, success } = await res.json();

            if (!res.ok || !success) {
                toast.error('An unknown error occurred while updating the blog');
                setLoading(false);
                return;
            }

            toast.success('Blog updated successfully!', {
                description: 'Blog has been updated successfully.',
                duration: 4000,
                action: {
                    label: 'View Blog',
                    onClick: () => router.push(`/blogs/${data.id}`)
                }
            });

            setLoading(false);
            router.push('/blogs');

        } catch (error) {
            setLoading(false);
            toast.error("Service temporarily unavailable. Please try again later.")
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
                <FieldLabel htmlFor="excerpt">Except</FieldLabel>
                <Textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} required />
                {errors.properties?.excerpt?.errors?.length && <ul className="list-disc pl-4">{errors.properties.excerpt.errors.map((error: string, index: number) => (<li className="font-bold text-[12px] text-red-600" key={index}>{error}</li>))}</ul>}
            </Field>
            <Field>
                <FieldLabel htmlFor="intro">Introduction</FieldLabel>
                <Textarea id="intro" value={intro} onChange={(e) => setIntro(e.target.value)} required />
                {errors.properties?.intro?.errors?.length && <ul className="list-disc pl-4">{errors.properties.intro.errors.map((error: string, index: number) => (<li className="font-bold text-[12px] text-red-600" key={index}>{error}</li>))}</ul>}
            </Field>
            <Field>
                <FieldLabel htmlFor="blogImage">Blog Image</FieldLabel>
                <Input accept="image/png, image/gif, image/jpeg" type="file" id="blogImage" onChange={(e) => setBlogImage(e.target.files ? e.target.files[0] : null)} required />
                {errors.properties?.blogImage?.errors?.length && <ul className="list-disc pl-4">{errors.properties.blogImage.errors.map((error: string, index: number) => (<li className="font-bold text-[12px] text-red-600" key={index}>{error}</li>))}</ul>}
            </Field>

            <FieldGroup>
                <FieldDescription className="font-semibold text-lg py-2">Story Sections</FieldDescription>
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

                    </div>
                ))}
                <div className="flex justify-start">
                    <Button type="button" onClick={() => addStorySection()}>
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
                {loading ? 'Updating...' : 'Update Blog'}
            </Button>
            {loading && (
                <Dialog open={loading}>
                    <DialogContent
                        className="sm:max-w-sm"
                        onInteractOutside={(e) => e.preventDefault()}
                        showCloseButton={false}
                        onEscapeKeyDown={(e) => e.preventDefault()}
                    >
                        <div className="flex flex-col items-center gap-4 py-6">
                            <p className="font-bold text-md">Updating Blog</p><CustomSpinner />
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </Form>
    )
}