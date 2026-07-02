import { Blog } from "../types/blog";

export async function getBlogs(options: {
    page?: string;
    limit?: string;
    search?: string
}): Promise<{
    data?: {
        blogs: Blog[],
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        }
    };
    success: boolean;
    error?: string;
}> {
    try {
        const { limit = "10", page = "1", search } = options;
        const params = new URLSearchParams();

        params.set('page', page);
        params.set('limit', limit);
        search && params.set('search', search);

        const res = await fetch(`${process.env.NEST_API_URL}/blogs?${params.toString()}`, {
            method: 'GET'
        });

        if (!res.ok) {
            const errorMessage = await res.json();

            return {
                success: false,
                error: errorMessage.error.message
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
            error: error instanceof Error ? error.message : String(error)
        }
    }
}