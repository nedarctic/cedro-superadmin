import { Booking } from "./booking";

export type Tour = {
    id: string;
    title: string;
    bookings?: Booking[];
    createdAt: string;
    updatedAt: string;
}