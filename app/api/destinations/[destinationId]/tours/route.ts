import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

type TourJson = {
    description: string,
    duration: string,
    title: string,
    dates: string,
    groupSize: string,
    price: string,
    activities: string[],
    excluded: string[],
    included: string[],
};

const tourValidationSchema = z.object({
    description: z.string(),
    duration: z.string(),
    title: z.string(),
    dates: z.string(),
    
    groupSize: z.string()
        .transform(value => value.trim())
        .transform(value => Number(value))
        .pipe(z.number()
            .positive('Group size cannot be negative')
            .min(2, 'Group cannot be lower than 2'))
            .transform(value => String(value)),


    price: z.string()
        .transform(value => value.trim())
        .transform(value => Number(value))
        .pipe(z.number().positive('Price cannot be negative')
        )
        .transform(value => String(value)),

    activities: z.array(z.string().min(1, "Activity item cannot be empty")),
    excluded: z.array(z.string().min(1, 'Excluded item cannot be empty')),
    included: z.array(z.string().min(1, 'Included item field cannot be empty')),
    tourImage: z.instanceof(File)
        .refine(file => file.size > 0, { message: "Tour image missing" })
        .refine(file => ['image/jpeg', 'image/png', 'image/gif'].includes(file.type), { message: "Only JPEG and PNG images allowed" })
        .refine(file => file.size < 5 * 1024 * 1024, { message: "Maximum allowed file size is 5MB" })
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ destinationId: string }> }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.redirect(new URL('/login', req.url));
        }

        const { accessToken } = session;
        const { destinationId } = await params;

        console.log('access token at tour api creation handler', accessToken);

        const formData = await req.formData();

        const tourJsonData = formData.get('tour');
        console.log('Tour JSON at API route handler', tourJsonData)

        if (typeof tourJsonData !== 'string') {
            return NextResponse.json({
                success: false,
                error: `Tour data type mismatch. Expected string but received ${typeof tourJsonData}`
            })
        }

        const tourData: TourJson = JSON.parse(tourJsonData);

        const parsedData = tourValidationSchema.safeParse({
            description: tourData.description,
            duration: tourData.duration,
            title: tourData.title,
            dates: tourData.dates,
            groupSize: tourData.groupSize,
            price: tourData.price,
            activities: tourData.activities,
            excluded: tourData.excluded,
            included: tourData.included,
            tourImage: formData.get('tourImage')
        })

        if (!parsedData.success) {
            const error = parsedData.error.message;
            console.log('error validating tour data:', error)
            return NextResponse.json({
                success: false,
                error: error || 'validation error'
            })
        }

        // reconstruct form data with parsed and validated fields

        const tourFormData = new FormData();

        const {tourImage, ...tour} = parsedData.data;

        tourFormData.append('tour',
            JSON.stringify({
                ...tour
            })
        )

        tourFormData.append('tourImage', parsedData.data.tourImage);

        const res = await fetch(`${process.env.NEST_API_URL}/tours/${destinationId}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            body: tourFormData
        })

        if (!res.ok) {
            const errorMessage = await res.json();
            console.log('error creating tour', errorMessage)
            return NextResponse.json({
                success: false,
                error: errorMessage.error.message || 'Backend request error'
            })
        }

        const { success, data } = await res.json();

        return NextResponse.json({ success, data })
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : String(error)
        }, { status: 500 })
    }

}