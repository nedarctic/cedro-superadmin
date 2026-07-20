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

        console.log("access token at create member", accessToken)

        const formData = await req.formData();

        const res = await fetch(`${process.env.NEST_API_URL}/team`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            body: formData
        });

        console.log("Create member response", res);

        const { data, success, error } = await res.json();

        console.log("Create member response json:", data, "success:", success, "error:", error)

        if (!res.ok) {
            const errorMessage = error;
            console.log('error creating team member:', errorMessage);
            
            return NextResponse.json({
                success: false,
                error: errorMessage || 'An error occurred while adding the team member'
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