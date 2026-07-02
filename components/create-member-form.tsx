'use client'

import { useState, SubmitEvent } from 'react';
import { Form } from './ui/form';
import { Field, FieldLabel } from './ui/field';
import { Input } from './ui/input';
import { Button } from './ui/button';
import z from 'zod';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent } from './ui/dialog';
import { CustomSpinner } from './custom-spinner';
import { toast } from 'sonner';
import { Textarea } from './ui/textarea';

const memberCreationSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    designation: z.string().min(1, { message: "Designation is required" }),
    description: z.string().min(1, { message: "Description is required" }).max(200, "Description should not exceed 200 characters"),
    memberImage: z.instanceof(File, { message: "Member image is required" })
        .refine(file => file.size > 0, { message: "File is required" })
        .refine(file => file.size <= 5 * 1024 * 1024, { message: "File size must be less than 5MB" })
        .refine(file => ['image/jpeg', 'image/png'].includes(file.type), { message: "File must be a JPEG or PNG image" })
})

export function CreateMemberForm() {
    const router = useRouter();

    const [name, setName] = useState<string>('');
    const [designation, setDesignation] = useState<string>('');
    const [description, setDescription] = useState<string>('')
    const [memberImage, setMemberImage] = useState<File | null>(null);

    const [errors, setErrors] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const [generalError, setGeneralError] = useState<any>();

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = {
            name,
            designation,
            description,
            memberImage
        };

        try {
            setLoading(true);
            const parsedData = memberCreationSchema.safeParse(formData);

            if (!parsedData.success) {
                setErrors(z.treeifyError(parsedData.error));
                setLoading(false);
                return;
            }

            const memberFormData = new FormData();
            memberFormData.append('name', name);
            memberFormData.append('designation', designation);
            memberFormData.append('description', description);
            memberFormData.append('memberImage', memberImage as File);

            const res = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/team`, {
                method: 'POST',
                body: memberFormData
            });

            if (!res.ok) {
                const error = res.text();
                toast.error('An error occurred adding new team member', {
                    description: error
                })
                setGeneralError(error);
                setLoading(false);
                return;
            }

            toast.success('Successfully addedd new team member')
            setErrors({})
            setLoading(false);
            router.push('/team')

        } catch (error) {
            setGeneralError(String(error));
        }
    }

    return (
        <Form className="flex flex-col w-full max-w-7xl mx-auto gap-4" onSubmit={handleSubmit}>

            <Field>
                <FieldLabel htmlFor='name'>Name</FieldLabel>
                <Input placeholder="Name"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                {errors?.properties?.name?.errors?.length && <ul className="list-disc pl-4">{errors.properties.name.errors.map((error: string, index: number) => (<li className="font-bold text-[12px] text-red-600" key={index}>{error}</li>))}</ul>}
            </Field>

            <Field>
                <FieldLabel htmlFor='designation'>Designation</FieldLabel>
                <Input placeholder="Designation"
                    id='designation'
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)} />
                {errors?.properties?.designation?.errors?.length && <ul className="list-disc pl-4">{errors.properties.designation.errors.map((error: string, index: number) => (<li className="font-bold text-[12px] text-red-600" key={index}>{error}</li>))}</ul>}
            </Field>

            <Field>
                <FieldLabel htmlFor='description'>Description</FieldLabel>
                <Textarea placeholder="Description"
                    id='description'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)} />
                {errors?.properties?.description?.errors?.length && <ul className="list-disc pl-4">{errors.properties.description.errors.map((error: string, index: number) => (<li className="font-bold text-[12px] text-red-600" key={index}>{error}</li>))}</ul>}
            </Field>

            <Field>
                <FieldLabel htmlFor='memberImage'>Select member image</FieldLabel>
                <Input type="file"
                    id='memberImage'
                    accept='image/png, image/jpeg'
                    onChange={(e) => setMemberImage(e.target.files ? e.target.files[0] : null)} />
                {errors?.properties?.memberImage?.errors?.length && <ul className="list-disc pl-4">{errors.properties.memberImage.errors.map((error: string, index: number) => (<li className="font-bold text-[12px] text-red-600" key={index}>{error}</li>))}</ul>}
            </Field>

            <Button type="submit"
                className="bg-black text-white py-2 px-4 rounded-md">Create Member</Button>

            {loading && (
                <Dialog open={loading}>
                    <DialogContent
                        className="sm:max-w-sm"
                        onInteractOutside={(e) => e.preventDefault()}
                        showCloseButton={false}
                        onEscapeKeyDown={(e) => e.preventDefault()}
                    >
                        <div className="flex flex-col items-center gap-4 py-6">
                            <p className="font-bold text-md">Adding New Team Member</p><CustomSpinner />
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </Form>
    )
}