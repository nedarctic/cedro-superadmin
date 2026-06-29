import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ destinationId: string }> }) {

    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            redirect('/login')
        }
        const { accessToken } = session;
        const { destinationId } = await params;

        const body = await req.json();

        const res = await fetch(`${process.env.NEST_API_URL}/destinations/${destinationId}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            const errorMessage = await res.json();
            return NextResponse.json({
                success: false,
                error: errorMessage.message,
            }, { status: res.status });
        };

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

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ destinationId: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            redirect('/login');
        }
        const { accessToken } = session;
        const { destinationId } = await params;

        const res = await fetch(`${process.env.NEST_API_URL}/destinations/${destinationId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        })

        const { data, success } = await res.json();

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