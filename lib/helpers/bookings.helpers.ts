import { Booking } from "../types/booking";

export async function getBookings(accessToken: string, options: {
    page?: string,
    limit?: string,
    search?: string
}) {
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

        const url = new URL(`${process.env.NEST_API_URL}/bookings?${params.toString()}`)

        const res = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });

        if (!res.ok) {
            const error = (await res.json()).message;
            return {
                success: false,
                error,
            }
        }

        const data = await res.json();
        console.log('Bookings data at helper:', data);

        return {
            success: true,
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

// get booking
export async function getBooking (bookingId: string, accessToken: string, url: string): Promise<{
    data?: Booking;
    success: boolean;
    error?: string;
}> {
    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const data = await res.json();

        if (!res.ok) {
            return {
                success: false,
                error: data
            }
        }
        
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