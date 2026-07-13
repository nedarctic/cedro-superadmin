import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ blogId: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.redirect('/login')
        }
        const { accessToken } = session;
        const { blogId } = await params;

        const formData = await req.formData();

        const res = await fetch(`${process.env.NEST_API_URL}/blogs/${blogId}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: formData
        });

        if (!res.ok) {
            const error = (await res.json()).error.message;
            return NextResponse.json({
                success: false,
                error: error || 'Backend request error'
            })
        }

        const { data, success } = await res.json()
        return NextResponse.json({ success, data })

    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : String(error)
        });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ blogId: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.redirect('/login')
        }
        const { accessToken } = session;
        const { blogId } = await params;

        const res = await fetch(`${process.env.NEST_API_URL}/blogs/${blogId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        })

        if (!res.ok) {
            const errorMessage = await res.json();
            return NextResponse.json({
                success: false,
                error: errorMessage.error.message
            })
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