import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ tourId: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session) {
            return NextResponse.redirect(new URL('/login', req.url));
        }

        const { accessToken } = session;
        const { tourId } = await params;

        const formData = await req.formData();
        const res = await fetch(`${process.env.NEST_API_URL}/itineraries/${tourId}/bulk`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: formData
        });

        if (!res.ok) {
            const errorMessage = await res.json();
            return NextResponse.json({
                success: false,
                error: errorMessage.error.message || 'Backend request error'
            }, { status: res.status });
        }

        const { data, success } = await res.json();

        return NextResponse.json({
            success, data
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : String(error)
        })
    }
}