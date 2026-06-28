import { Tour } from "./tour";

export type Booking = {
    id: string;
    name: string;
    email: string;
    tourId: string;
    tour: Tour;
    createdAt: string;
    updatedAt: string;
}[]