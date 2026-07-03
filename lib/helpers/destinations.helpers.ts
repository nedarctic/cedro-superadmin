import { Destination } from "../types/destination";

// get destination
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

// get destination
export async function getDestination (destinationId: string) {
    try {
        const res = await fetch(`${process.env.NEST_API_URL}/blog/${destinationId}`, {
            method: 'GET'
        });

        if (!res.ok) {
            const error = (await res.json()).error.message;
            return {
                success: false,
                error: error || 'Backend request error'
            }
        }

        const { success, data } = await res.json();
        
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