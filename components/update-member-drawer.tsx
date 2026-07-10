'use client'

import { TeamMember } from "@/lib/types/team-member";
import { Button } from "./ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerPanel,
    DrawerPopup,
    DrawerTitle,
    DrawerTrigger
} from "./ui/drawer";
import { Form } from "./ui/form";
import { useState, SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import { Field, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import z from "zod";
import { toast } from "sonner";
import Image from "next/image";

const updateMemberSchema = z.object({
    name: z.string()
        .min(1, "Name required")
        .max(200, "Keep name shorter than 200 characters"),
    designation: z.string()
        .min(1, "Designation required")
        .max(200, "Keep designation shorter than 200 characters"),
    description: z.string()
        .min(1, "Description required")
        .max(200, "Keep description shorter than 200 characters"),
    memberImage: z.instanceof(File)
        .optional()
        .refine(file => !file || file.size < 5 * 1024 * 1024, { message: "Maximum allowed image size is 5MB" })
        .refine(file => !file || ['image/png', 'image/jpeg'].includes(file.type), { message: "Only PNG and JPEG images allowed" }),
    level: z.string()
        .min(1, "Level cannot be empty")
        .trim()
        .transform(value => Number(value))
        .pipe(z.number()
            .positive("The level should be a positive number")
            .max(10, "Level cannot be more than 10")
        )
})

export function UpdateMemberDrawer({ teamMember }: { teamMember: TeamMember }) {
    console.log('team member name', teamMember.name)
    const router = useRouter();

    const [name, setName] = useState<string>(teamMember?.name);
    const [designation, setDesignation] = useState<string>(teamMember?.designation);
    const [description, setDescription] = useState<string>(teamMember?.description);
    const [memberImage, setMemberImage] = useState<File | null>();
    const [level, setLevel] = useState<string>(teamMember?.level || '');

    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [errors, setErrors] = useState<any>({});

    const updateHandler = async (e: SubmitEvent) => {
        e.preventDefault();

        try {
            setLoading(true);

            const validationResult = updateMemberSchema.safeParse({
                name,
                designation,
                description,
                memberImage,
                level
            });

            if (!validationResult.success) {
                setErrors(z.treeifyError(validationResult.error));
                setLoading(false);
                setOpen(false);
                toast.error("Update member failed");
                return;
            }

            const formData = new FormData();
            formData.append('name', name);
            formData.append('designation', designation);
            formData.append('description', description);
            memberImage && memberImage.size > 0 && formData.append('memberImage', memberImage!);
            formData.append('level', level);

            const res = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/team/${teamMember.id}`, {
                method: 'PATCH',
                body: formData
            });

            const { success, data, error } = await res.json();

            if (!res.ok || !success) {
                setLoading(false);
                setOpen(false);
                toast.error("Update member failed", {
                    description: error.message || "Backend request error",
                })
            }

            setLoading(false);
            setOpen(false);
            toast.success("Member updated successfully!")
            router.refresh();

        } catch (error) {
            toast.error("Service temporarily unavailable.")
        }
    }

    return (
        <Drawer position="right" open={open} onOpenChange={setOpen}>
            <DrawerTrigger render={<Button variant="outline" />}>
                Update Member
            </DrawerTrigger>
            <DrawerPopup variant="inset" className="h-full">
                <DrawerPanel>

                    <DrawerHeader className="pl-0">
                        <DrawerTitle>Update Member</DrawerTitle>
                    </DrawerHeader>

                    <DrawerContent>
                        <Form onSubmit={updateHandler} className="flex flex-col justify-between gap-4 h-full">
                            <div className="flex flex-col gap-2">
                                <Field>
                                    <FieldLabel>Name</FieldLabel>
                                    <Input type="text" value={name} onChange={e => setName(e.target.value)} />
                                    {errors?.properties?.name?.errors?.length && <ul className="pl-4 list-disc">
                                        {errors.properties.name.errors.map((error: string, index: number) => <li key={index}
                                            className="text-sm font-bold text-red-600">{error}</li>)}
                                    </ul>}
                                </Field>
                                <Field>
                                    <FieldLabel>Designation</FieldLabel>
                                    <Input type="text" value={designation} onChange={e => setDesignation(e.target.value)} />
                                    {errors?.properties?.designation?.errors?.length && <ul className="pl-4 list-disc">
                                        {errors.properties.designation.errors.map((error: string, index: number) => <li key={index}
                                            className="text-sm font-bold text-red-600">{error}</li>)}
                                    </ul>}
                                </Field>
                                <Field>
                                    <FieldLabel>Description</FieldLabel>
                                    <Textarea maxLength={200} value={description} onChange={e => setDescription(e.target.value)} />
                                    {errors?.properties?.description?.errors?.length && <ul className="pl-4 list-disc">
                                        {errors.properties.description.errors.map((error: string, index: number) => <li key={index}
                                            className="text-sm font-bold text-red-600">{error}</li>)}
                                    </ul>}
                                </Field>
                                <div className="relative aspect-square w-full">
                                    <Image
                                        src={teamMember.memberImageUrl}
                                        unoptimized
                                        fill
                                        className="rounded-lg object-cover object-top"
                                        alt={`${teamMember.designation} picture`}
                                    />
                                </div>
                                <Field>
                                    <FieldLabel>Member image</FieldLabel>
                                    <Input type="file" accept="image/png, image/jpeg"
                                        onChange={e => setMemberImage(e.currentTarget.files && e.currentTarget.files[0])} />
                                    {errors?.properties?.memberImage?.errors?.length && <ul className="pl-4 list-disc">
                                        {errors.properties.memberImage.errors.map((error: string, index: number) => <li key={index}
                                            className="text-sm font-bold text-red-600">{error}</li>)}
                                    </ul>}
                                </Field>
                                <Field>
                                    <FieldLabel>Level</FieldLabel>
                                    <Input type="text" value={level} onChange={e => setLevel(e.target.value)} />
                                    {errors?.properties?.level?.errors?.length && <ul className="pl-4 list-disc">
                                        {errors.properties.level.errors.map((error: string, index: number) => <li key={index}
                                            className="text-sm font-bold text-red-600">{error}</li>)}
                                    </ul>}
                                </Field>
                            </div>
                            <div className="flex flex-row justify-end gap-4">
                                <DrawerClose render={<Button variant="outline" />}>Cancel</DrawerClose>
                                <Button type="submit" disabled={loading}>{loading ? "Updating..." : "Update"}</Button>
                            </div>
                        </Form>
                    </DrawerContent>

                </DrawerPanel>
            </DrawerPopup>
        </Drawer>
    )
}