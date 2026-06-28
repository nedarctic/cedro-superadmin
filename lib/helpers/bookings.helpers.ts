export async function getBookings(options: {
    accessToken?: string,
    page?: string,
    limit?: string,
    search?: string
}) {
    try {

        const {
            limit = "10",
            page = "1",
            accessToken,
            search
        } = options;

        const params = new URLSearchParams();
        params.set('page', page);
        params.set('limit', limit);
        search && params.set('search', search);

        const url = new URL(`${process.env.NEST_API_URL}/bookings?${params.toString()}`)

        const res = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
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