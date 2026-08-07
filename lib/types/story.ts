import { StorySection } from "./story-section";

export type Story = {
    id: string;
    intro: string;
    sections: StorySection[];
    conclusion: string;
    blogId: string;
    createdAt: string;
    updatedAt: string;
}