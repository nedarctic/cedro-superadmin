export async function getDashKpis(accessToken: string): Promise<{
    success: boolean;
    data?: {
        totalBlogs: number;
        totalBookings: number;
        totalDestinations: number;
        totalMembers: number
        totalTours: number;
    },
    error?: string;
}> {
    try {
        const url = `${process.env.NEST_API_URL}/dash/kpis`;
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const { data, success, error } = await res.json();

        if (!res.ok) {
            return {
                success: false,
                error: error.message || "Backend request error"
            }
        };

        return {
            success,
            data
        }

    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error)
        }
    }
}