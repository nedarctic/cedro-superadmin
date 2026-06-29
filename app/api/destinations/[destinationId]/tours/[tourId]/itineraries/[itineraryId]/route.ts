import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ itineraryId: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            redirect('/login')
        }
        const { accessToken } = session;
        const { itineraryId } = await params;

        const formData = await req.formData();
        const res = await fetch(`${process.env.NEST_API_URL}/itineraries/${itineraryId}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            body: formData
        });

        if (!res.ok) {
            const errorMessage = await res.json()
            return NextResponse.json({
                success: false,
                error: errorMessage.message || 'Backend request error'
            }, { status: res.status })
        }

        const { data, success } = await res.json();
        return NextResponse.json({ data, success });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : String(error)
        }, { status: 500 })
    }

}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ itineraryId: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            redirect('/login')
        }
        const { accessToken } = session;
        const { itineraryId } = await params;

        const res = await fetch(`${process.env.NEST_API_URL}/itineraries/${itineraryId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        });

        if (!res.ok) {
            const errorMessage = await res.json()
            return NextResponse.json({
                success: false,
                error: errorMessage.message || 'Backend request error'
            }, { status: res.status })
        }

        const { data, success } = await res.json();
        return NextResponse.json({ data, success });
        
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : String(error)
        }, { status: 500 })
    }

}