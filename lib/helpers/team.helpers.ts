import { TeamMember } from "../types/team-member";

export async function getTeam (options: {
    page?: string;
    limit?: string;
    search?: string
}): Promise<{
    data?: {
        team: TeamMember[],
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

        const res = await fetch(`${process.env.NEST_API_URL}/team?${params.toString()}`, {
            method: 'GET'
        });

        if (!res.ok) {
            const errorMessage = await res.json();
            console.log('error fetching team members', errorMessage.error.message)
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