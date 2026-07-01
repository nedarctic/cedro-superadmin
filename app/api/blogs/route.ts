import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.redirect(new URL('/login', req.url));
        }

        const { accessToken } = session;

        const formData = await req.formData();

        const res = await fetch(`${process.env.NEST_API_URL}/blogs`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            body: formData
        });

        const { data, success, error } = await res.json();

        if (!res.ok) {
            const errorMessage = error;
            console.log('error creating blog:', errorMessage);
            return NextResponse.json({
                success: false,
                error: errorMessage || 'An error occurred while creating the blog'
            })
        }

        return NextResponse.json({
            data,
            success
        })

    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        })
    }
}