import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ tourId: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.redirect(new URL("/login", req.nextUrl.hostname))
        }
        const { accessToken } = session;
        const { tourId } = await params;

        const formData = await req.formData();
        console.log("formdata for patch at route handler");
        for(const [key, value] of formData.entries()){
            console.log(`key ${key}, value ${value}`);
        }

        const url = `${process.env.NEST_API_URL}/tours/${tourId}`;
        const res = await fetch(url, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            body: formData
        })

        const data = await res.json();

        if(!res.ok){
            return NextResponse.json({
                success: false,
                error: data
            })
        }

        return NextResponse.json({
            success: true,
            data
        })

    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : String(error)
        })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ tourId: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.redirect(new URL("/login", req.nextUrl.hostname))
        }
        const { accessToken } = session;
        const { tourId } = await params;

        const url = `${process.env.NEST_API_URL}/tours/${tourId}`;
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const data = await res.json();

        if(!res.ok){
            return NextResponse.json({
                success: false,
                error: data
            })
        }

        return NextResponse.json({
            success: true,
            data
        })

    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : String(error)
        })
    }
}