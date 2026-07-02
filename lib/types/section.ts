import { Blog } from "./blog";

export type Section = {
    id: string;
    section: string;
    subtitle: string;
    content: string;
    sectionImageKey: string;
    sectionImageUrl: string;
    blog: Blog;
    blogId: string;
    createdAt: string;
    updatedAt: string;
}