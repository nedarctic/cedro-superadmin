import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest, {
    params
}: {
    params: Promise<{
        destinationId: string;
        tourId: string;
    }>
}) {

    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.redirect('/login');
        }
        const { accessToken } = session;

        const { tourId } = await params;
        const payload = await req.json();

        const { name, email } = payload;

        const res = await fetch(`${process.env.NEST_API_URL}/bookings/${tourId}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email })
        });

        const { data, error, success } = await res.json();

        if (!res.ok) {
            return NextResponse.json({
                success: false,
                error: error
            })
        }

        return NextResponse.json({
            success,
            data
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : String(error)
        }, { status: 500 })
    }

}