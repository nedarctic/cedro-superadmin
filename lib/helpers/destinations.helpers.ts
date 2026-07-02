import { Destination } from "../types/destination";

export async function getDestinations(): Promise<{
    data?: {
        destinations: Destination[],
        meta: {
            page: number;
            limit?: number,
            total: number;
            totalPages?: number;
        }
    },
    success: boolean;
    error?: string;
}> {
    try {
        const res = await fetch(`${process.env.NEST_API_URL}/destinations`, {
            method: 'GET',
        });

        const { data, success } = await res.json();

        return {
            data,
            success,
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error)
        }
    }
}