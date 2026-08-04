import { Destination } from "../types/destination";

// get destination
export async function getDestinations(url: string): Promise<{
    data?: Destination[] | {
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
        const res = await fetch(url, {
            method: 'GET',
        });

        if(!res.ok) {
            const error = (await res.json()).message;
            return {
                success: false,
                error
            }
        }

        const data = await res.json();
        
        return {
            data,
            success: true,
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error)
        }
    }
}

// get destination
export async function getDestination (destinationId: string): Promise<{
    success: boolean;
    data?: Destination;
    error?: string;
}> {
    try {
        const res = await fetch(`${process.env.NEST_API_URL}/destinations/${destinationId}`, {
            method: 'GET'
        });

        if (!res.ok) {
            const error = (await res.json()).message;
            return {
                success: false,
                error: error || 'Backend request error'
            }
        }

        const data = await res.json();
        
        return {
            success: true,
            data
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error)
        }
    }
}