import { Booking } from "./booking";
import { Destination } from "./destination";
import { Itinerary } from "./itinerary";

export type Tour = {
    id: string;
    title: string;
    intro: string;
    activities: string[];
    included: string[];
    excluded: string[];
    destination: Destination;
    dates: string;
    duration: string;
    imageKey: string;
    tourImage: string;
    groupSize: number;
    price: number;
    itinerary: Itinerary[];
    destinationId: string;
    totalBookings?: string;
    bookings?: Booking[];
    createdAt: string;
    updatedAt: string;
    tourType: "GROUP" | "PRIVATE";
}
