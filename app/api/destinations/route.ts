import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.redirect(new URL('/login', req.url));
        }

        const { accessToken } = session;
        console.log('token at destinations api route handler', accessToken)

        const body = await req.json();

        const res = await fetch(`${process.env.NEST_API_URL}/destinations`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const errorMessage = await res.json();
            return NextResponse.json({
                success: false,
                error: errorMessage.error.message,
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