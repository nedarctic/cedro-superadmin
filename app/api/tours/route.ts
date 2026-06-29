import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            redirect('/login');
        }

        const { accessToken } = session;

        const formData = await req.formData();
        const res = await fetch(`${process.env.NEST_API_URL}/tours`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            body: formData
        })

        if (!res.ok) {
            const errorMessage = await res.json();
            return NextResponse.json({
                success: false,
                error: errorMessage.message || 'Backend request error'
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