'use client';

import { useState, SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import { Blog } from "@/lib/types/blog";
import { Section } from "@/lib/types/section";
import { Form } from "./ui/form";
import { Field, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import Image from "next/image";
import { Button } from "./ui/button";
import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import z from "zod";
import { toast } from "sonner";
import { Dialog, DialogContent } from "./ui/dialog";
import { CustomSpinner } from "./custom-spinner";

type BlogSections = (Partial<Section> & { sectionImage?: File | null })[];

const sectionsSchema = z.object({
    subtitle: z.string().min(1, "Subtitle is required"),
    content: z.string().min(1, "Content is required"),
    sectionImage: z.instanceof(File)
        .nullable()
        .optional()
        .refine(file => !file || file.size < 5 * 1024 * 1024, { message: "Maximum allowed image size is 5MB" })
        .refine(file => !file || ['image/png', 'image/jpeg', 'image/gif'].includes(file.type), { message: "Allowed image types are PNG, JPEG and GIF only" })
})

const blogSchema = z.object({
    title: z.string().min(1, "Title is required"),
    intro: z.string().min(1, "Introduction is required"),
    conclusion: z.string().min(1, "Conclusion is required"),
    blogImage: z.instanceof(File)
        .optional()
        .refine(file => !file || file.size < 5 * 1024 * 1024, { message: "Maximum allowed file size is 5MB" })
        .refine(file => !file || ['image/png', 'image/jpeg', 'image/gif'].includes(file.type), { message: "Allowed image types are PNG, JPEG and GIF only." }),
    sections: z.array(sectionsSchema).min(1, "At least one section is required"),
})

export function UpdateBlogForm({ blog }: { blog: Blog }) {
    const router = useRouter();

    const [title, setTitle] = useState<string>(blog.title);
    const [intro, setIntro] = useState<string>(blog.intro);
    const [conclusion, setConclusion] = useState<string>(blog.conclusion);
    const [blogImage, setBlogImage] = useState<File | null>();

    const blogSections: BlogSections = blog.sections.map(section => ({ ...section, sectionImage: null }));
    const [sections, setSections] = useState<BlogSections>(blogSections);

    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<any>({})

    const updateHandler = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setLoading(true);

            const validationResult = blogSchema.safeParse({
                title,
                intro,
                conclusion,
                blogImage,
                sections
            });

            if (validationResult.error) {
                setErrors(z.treeifyError(validationResult.error));
                setLoading(false);
                console.log(validationResult.error);
                toast.error("Form validation errors");
                return;
            };


            const formData = new FormData();
            const sectionsWithImages: string[] = [];

            const sectionsData = sections.map(({
                id,
                section,
                content,
                subtitle,
                sectionImageUrl,
                sectionImageKey,
                sectionImage
            }) => {

                if (sectionImage && sectionImage.size > 0) {
                    formData.append('sectionImages', sectionImage);
                    sectionsWithImages.push(id!);
                }

                return {
                    id,
                    section,
                    subtitle,
                    content,
                    sectionImageUrl,
                    sectionImageKey
                }
            });

            const blogData = {
                title,
                intro,
                conclusion,
                sections: sectionsData
            };

            formData.append('blog', JSON.stringify({ blogData }));

            console.log('blog data', blogData);

            blogImage && blogImage.size > 0 && formData.append('blogImage', blogImage);

            sectionsWithImages && formData.append('sectionsWithImages', JSON.stringify({ sectionsWithImages }));

            console.log("SECTIONS", sections)
            const url = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/blogs/${blog.id}`
            
            const res = await fetch(url, {
                method: "PATCH",
                body: formData,
            });

            const { success, data, error } = await res.json();

            if (!res.ok) {
                setLoading(false);
                toast.error("Failed to update blog");
                return;
            }

            setLoading(false);
            toast.success("Blog successfully edited");
            router.push(`/blogs/${blog.id}`);

        } catch (error) {
            setLoading(false);
            toast.error("Service temporarily unavailable")
        }
    }

    return (
        <Form className="flex flex-col gap-4" onSubmit={updateHandler}>
            <Field>
                <FieldLabel>Title</FieldLabel>
                <Input value={title} onChange={e => setTitle(e.target.value)} />
                {errors?.properties?.title?.errors?.length && <ul className="list-disc pl-4">
                    {errors.properties.title.errors.map((error: string, index: string) =>
                        <li key={index} className="text-red-600 text-sm font-bold">{error}</li>
                    )}
                </ul>}
            </Field>
            <Field>
                <FieldLabel>Introduction</FieldLabel>
                <Textarea value={intro} onChange={e => setIntro(e.target.value)} />
                {errors?.properties?.intro?.errors?.length && <ul className="list-disc pl-4">
                    {errors.properties.intro.errors.map((error: string, index: string) =>
                        <li key={index} className="text-red-600 text-sm font-bold">{error}</li>
                    )}
                </ul>}
            </Field>
            <div className="flex flex-col gap-2">
                <h2 className="font-extrabold text-md">Blog image</h2>
                <div className="relative aspect-video w-full max-w-7xl">

                    <Image src={blog.blogImageUrl} alt={"Blog image"} fill unoptimized className="rounded-2xl" />
                </div>
            </div>
            <Field>
                <FieldLabel>Blog image</FieldLabel>
                <Input type="file" accept="image/png, image/jpeg, image/gif"
                    onChange={e => setBlogImage(e.currentTarget.files && e.currentTarget.files[0])}
                />
                {errors?.properties?.title?.errors?.length && <ul className="list-disc pl-4">
                    {errors.properties.titleblogImage.errors.map((error: string, index: string) =>
                        <li key={index} className="text-red-600 text-sm font-bold">{error}</li>
                    )}
                </ul>}
            </Field>


            <h2 className="font-extrabold text-md">Sections</h2>
            <ul className="flex flex-col gap-6">
                {sections.map((section, index) => {
                    return <li key={index} className="rounded-2xl border-2 p-6 flex flex-col gap-4">
                        <div className="flex flex-row gap-4 justify-between w-full">
                            <h3 className="font-extrabold text-md">{`Section ${index + 1}`}</h3>
                            <Button
                                type="button"
                                className="max-w-fit"
                                onClick={() => setSections(prev => {
                                    const copy = [...prev];
                                    return copy.filter((_, i) => i !== index);
                                })}
                                disabled={sections.length === 1}
                                variant="destructive"><Trash2Icon size={16} />Remove section</Button>
                        </div>
                        <Field>
                            <FieldLabel>Subtitle</FieldLabel>
                            <Input value={section.subtitle} onChange={e => {
                                setSections(prev => {
                                    const copy = [...prev];
                                    copy[index] = { ...copy[index], subtitle: e.target.value };
                                    return copy;
                                })
                            }} />
                            {errors?.properties?.sections?.items?.[index]?.properties?.subtitle?.errors?.length && <ul className="list-disc pl-4">
                                {errors.properties.sections.items[index].properties.subtitle.errors.map((error: string, index: string) =>
                                    <li key={index} className="text-red-600 text-sm font-bold">{error}</li>
                                )}
                            </ul>}
                        </Field>
                        <Field>
                            <FieldLabel>Content</FieldLabel>
                            <Input value={section.content} onChange={e => {
                                setSections(prev => {
                                    const copy = [...prev];
                                    copy[index] = { ...copy[index], content: e.target.value };
                                    return copy;
                                })
                            }} />

                            {errors?.properties?.sections?.items?.[index]?.properties?.content?.errors?.length &&
                                <ul className="list-disc pl-4">
                                    {errors.properties.sections.items[index].properties.content.errors.map((error: string, index: string) =>
                                        <li key={index} className="text-red-600 text-sm font-bold">{error}</li>
                                    )}
                                </ul>
                            }
                        </Field>

                        {section.sectionImageUrl ? <div className="flex flex-col gap-2">
                            <div className="relative aspect-video w-full max-w-7xl">
                                <Image src={section.sectionImageUrl!}
                                    fill
                                    unoptimized
                                    className="rounded-2xl"
                                    alt={"Section image"} />
                            </div>
                        </div> : ''}

                        <Field>
                            <FieldLabel>Section image</FieldLabel>
                            <Input type="file" accept="image/png, image/jpeg, image/gif"

                                onChange={(e) => {
                                    const file = e.currentTarget?.files?.[0];
                                    setSections(prev => {
                                        const copy = [...prev];
                                        copy[index] = { ...copy[index], sectionImage: file };
                                        return copy;
                                    })
                                }}
                            />
                            {errors?.properties?.sections?.items?.[index]?.properties?.sectionImage?.errors?.length &&
                                <ul className="list-disc pl-4">
                                    {errors.properties.sections.items[index].properties.sectionImage.errors.map((error: string, index: string) =>
                                        <li key={index} className="text-red-600 text-sm font-bold">{error}</li>
                                    )}
                                </ul>
                            }
                        </Field>
                    </li>
                })}
            </ul>

            <Button
                type="button"
                onClick={() => {
                    setSections(prev => [...prev, {
                        section: `Section ${prev.length + 1}`,
                        id: crypto.randomUUID(),
                        content: '',
                        subtitle: '',
                        sectionImage: null
                    }])
                }}><PlusIcon size={16} />Add section</Button>

            <Field>
                <FieldLabel>Conclusion</FieldLabel>
                <Textarea value={conclusion} onChange={e => setConclusion(e.target.value)} />
            </Field>

            <Button
                disabled={loading}
                type="submit"><PencilIcon size={16} />{loading ? "Updating..." : "Update blog"}</Button>

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