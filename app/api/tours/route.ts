import { type NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/login`);
        }
        const { accessToken } = session;

        const url = `${process.env.NEST_API_URL}/tours`;
        const formData = await req.formData();

        for(const [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        const response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({
                success: false,
                error: errorData.message || "Failed to create tour."
            }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json({
            success: true,
            data
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({
            success: false,
            error: "An error occurred while processing the request."
        }, { status: 500 });
    }
}