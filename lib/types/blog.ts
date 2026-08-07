import { Story } from "./story";

export type Blog = {
    id: string;
    title: string;
    date: string;
    excerpt: string;    
    blogImage: string;
    imageKey: string;
    story: Story;
    createdAt: string;
    updatedAt: string;
}
