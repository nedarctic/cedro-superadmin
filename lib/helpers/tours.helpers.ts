import { Tour } from "../types/tour";

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
            limit: number;
            total: number;
            totalPages: number;
        }
    }
}> {
    try {

        const {
            limit = "10",
            page = "1",
            search
        } = options;

        const params = new URLSearchParams();
        params.set('page', page);
        params.set('limit', limit);
        search && params.set('search', search);

        const url = new URL(`${process.env.NEST_API_URL}/tours?${params.toString()}`)

        const res = await fetch(url, {
            method: 'GET'
        });

        if (!res.ok) {
            const errorMessage = await res.json();
            return {
                success: false,
                error: errorMessage,
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