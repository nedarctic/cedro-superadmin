import { NextResponse, type NextRequest } from "next/server";

export async function POST (req: NextRequest) {
    try {
        const body = await req.json();
        const url = `${process.env.NEST_API_URL}/bookings`;

        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        const data = await res.json();

        if(!res.ok){
            return NextResponse.json({
                success: false,
                error: data,
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
        });
    }
}