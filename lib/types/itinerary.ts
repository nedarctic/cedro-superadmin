import { Tour } from "./tour";

export type Itinerary = {
    id: string;
    activities: string[];
    subtitle: string;
    day: string;
    itineraryImageKey: string;
    itineraryImageUrl: string;
    createdAt: string;
    updatedAt: string;
    tour: Tour;
    tourId: string;
};
