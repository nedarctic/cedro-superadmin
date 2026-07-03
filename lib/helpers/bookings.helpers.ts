import { Booking } from "../types/booking";

export async function getBookings(options: {
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

// get booking
export async function getBooking (bookingId: string): Promise<{
    data?: Booking;
    success: boolean;
    error?: string;
}> {
    try {
        const res = await fetch(`${process.env.NEST_API_URL}/bookings/${bookingId}`, {
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