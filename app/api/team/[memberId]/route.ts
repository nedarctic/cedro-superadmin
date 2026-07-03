import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ memberId: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.redirect('/login')
        }
        const { accessToken } = session;
        const { memberId } = await params;

        const res = await fetch(`${process.env.NEST_API_URL}/team/${memberId}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        })

        if (!res.ok) {
            const error = (await res.json()).error.message;
            return NextResponse.json({ success: false, error: error || 'Backend request error' })
        }

        const { data, success } = await res.json();

        return NextResponse.json({
            success,
            data
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : String(error)
        })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ memberId: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.redirect('/login')
        }
        const { accessToken } = session;
        const { memberId } = await params;

        const res = await fetch(`${process.env.NEST_API_URL}/team/${memberId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!res.ok) {
            const error = (await res.json()).error.message;
            return NextResponse.json({
                success: false,
                error: error || 'backend request error'
            });
        }

        const { data, success } = await res.json();

        return NextResponse.json({
            success,
            data
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : String(error)
        }, { status: 500 })
    }
}