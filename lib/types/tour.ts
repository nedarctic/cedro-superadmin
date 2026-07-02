import { Booking } from "./booking";
import { Destination } from "./destination";
import { Itinerary } from "./itinerary";

export type Tour = {
    id: string;
    title: string;
    description: string[];
    activities: string[];
    included: string[];
    excluded: string[];
    destination: Destination;
    dates: string;
    duration: string;
    tourImageKey: string;
    tourImageUrl: string;
    groupSize: string;
    price: string;
    itineraries: Itinerary[];
    destinationId: string;
    totalBookings?: string;
    bookings?: Booking[];
    createdAt: string;
    updatedAt: string;
}
