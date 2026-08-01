import { DestinationGuide } from "./destination-guide";
import { Tour } from "./tour";

export type Destination = {
    id: string;
    name: string;
    totalTours?: string;
    tour?: Tour[];
    createdAt: string;
    updatedAt: string;
    destinationGuides: DestinationGuide[];
    destinationImageKey: string;
    destinationImageUrl: string;
}