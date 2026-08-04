import { Booking } from "../types/booking";

type BookingChartPoint = {
    createdAt?: string | null;
};

export function buildBookingChartData(
    bookingData?: BookingChartPoint[] | null,
    fallbackData?: Record<string, number> | null,
): Record<string, number> {
    if (fallbackData && Object.keys(fallbackData).length > 0) {
        return fallbackData;
    }

    if (!bookingData?.length) {
        return {};
    }

    return bookingData.reduce<Record<string, number>>((acc, booking) => {
        if (!booking.createdAt) {
            return acc;
        }

        const parsedDate = new Date(booking.createdAt);
        if (Number.isNaN(parsedDate.getTime())) {
            return acc;
        }

        const month = parsedDate.toLocaleString("en-US", { month: "long" });
        acc[month] = (acc[month] ?? 0) + 1;

        return acc;
    }, {});
}

export async function getDashKpis(accessToken: string): Promise<{
    success: boolean;
    data?: {
        totalBlogs: number;
        totalBookings: number;
        totalDestinations: number;
        totalMembers: number
        totalTours: number;
        recentBookings: Booking[];
        past6MonthsBookings?: Record<string, number>;
    },
    error?: string;
}> {
    try {
        const url = `${process.env.NEST_API_URL}/dash/kpis`;
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const data = await res.json();

        if (!res.ok) {
            return {
                success: false,
                error: data || "Backend request error"
            }
        };

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
};

export async function getBookingChartData(accessToken: string): Promise<{
    data?: { createdAt: string }[];
    success: boolean;
    error?: string;
}> {
    try {
        const url = `${process.env.NEST_API_URL}/dash/booking-chart-data`;
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const { data, success, error } = await res.json();

        if (!res.ok) {
            return {
                success: false,
                error: error.message || "Backend request error"
            }
        };

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