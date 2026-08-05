import { Tour } from "./tour";

export type Itinerary = {
    id: string;
    activities: string[];
    title: string;
    day: string;
    imageKey: string;
    dayImage: string;
    createdAt: string;
    updatedAt: string;
    tour: Tour;
    tourId: string;
};
