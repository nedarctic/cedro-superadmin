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

        const url = `${process.env.NEST_API_URL}/team/${memberId}`;
        const contentType = req.headers.get("Content-Type") ?? "";
        
        let res;

        if(contentType.includes("multipart/form-data")){
            const formData = await req.formData();
            res = await fetch(url, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                body: formData
            })
        } else {
            const body = await req.json();
            res = await fetch(url, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            })
        }

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

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json({
                success: false,
                error: data || 'backend request error'
            });
        }        

        return NextResponse.json({
            success: true,
            data
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : String(error)
        }, { status: 500 })
    }
}