import { Destination } from "./destination";

export interface Guide {
    id: string;
    position: number;
    destinationId: string;
    subtitle: string;
    content: string;
    destination?: Destination;
    createdAt: string;
    updatedAt: string;
}