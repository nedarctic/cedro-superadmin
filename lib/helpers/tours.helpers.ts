import { Tour } from "../types/tour";

// get tours
export async function getTours(options: {
    page?: string,
    limit?: string,
    search?: string
}): Promise<{
    success: boolean;
    error?: string;
    data?: {
        tours: Tour[];
        meta: {
            page: number;
            limit?: number;
            total: number;
            totalPages?: number;
        }
    }
}> {
    try {

        const {
            limit,
            page = "1",
            search
        } = options;

        const params = new URLSearchParams();
        params.set('page', page);
        limit && params.set('limit', limit);
        search && params.set('search', search);

        const url = new URL(`${process.env.NEST_API_URL}/tours?${params.toString()}`)

        const res = await fetch(url, {
            method: 'GET'
        });

        if (!res.ok) {
            const errorMessage = await res.json();
            return {
                success: false,
                error: errorMessage.error.message,
            }
        }

        const { data, success } = await res.json();

        return {
            success,
            data
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ?
                error.message :
                String(error)
        }
    }

}

// get tour
export async function getTour (tourId: string): Promise<{
    success: boolean;
    data?: Tour,
    error?: string;
}> {
    try {
        const res = await fetch(`${process.env.NEST_API_URL}/tours/${tourId}`, {
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