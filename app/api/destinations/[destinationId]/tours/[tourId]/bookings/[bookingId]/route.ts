import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

export async function PATCH(req: NextRequest, { params }: {
    params: Promise<{
        destinationId: string;
        tourId: string;
        bookingId: string;
    }>
}) {
    try {

        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.redirect('/login');
        }
        const { accessToken } = session;
        const { bookingId } = await params;
        console.log("booking id", bookingId)
        const {name, email} = await req.json();

        console.log('payload at the booking patch api route handler', name, email)

        const res = await fetch(`${process.env.NEST_API_URL}/bookings/${bookingId}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name, email})
        });

        const { data, success, error } = await res.json();

        if (!res.ok || !success) {
            return NextResponse.json({
                success: false,
                error: error || "Backend request error"
            }, { status: res.status });
        };

        return NextResponse.json({
            success: true,
            data
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : String(error)
        }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: {
    params: Promise<{
        destinationId: string;
        tourId: string;
        bookingId: string;
    }>
}) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.redirect('/login');
        }
        const { accessToken } = session;
        const { bookingId } = await params;

        const res = await fetch(`${process.env.NEST_API_URL}/bookings/${bookingId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const { data, success, error } = await res.json();

        if (!res.ok || !success) {
            return NextResponse.json({
                success: false,
                error: error || "Backend request error"
            }, { status: res.status });
        }

        return NextResponse.json({
            success: true,
            data
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : String(error)
        }, { status: 500 })
    }
}