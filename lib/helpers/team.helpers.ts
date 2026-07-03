import { TeamMember } from "../types/team-member";

// get team
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
        const { limit, page, search } = options;
        const params = new URLSearchParams();

        page && params.set('page', page);
        limit && params.set('limit', limit);
        search && params.set('search', search);

        const res = await fetch(`${process.env.NEST_API_URL}/team?${params.toString()}`, {
            method: 'GET'
        });

        console.log('response', res)

        if (!res.ok) {
            const error = (await res.json()).message;
            console.log('error fetching team members', error)
            return {
                success: false,
                error
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

// get team member
export async function getMember (memberId: string) {
    try {
        const res = await fetch(`${process.env.NEST_API_URL}/team/${memberId}`, {
            method: 'GET'
        });

        if (!res.ok) {
            const error = (await res.json()).message;
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