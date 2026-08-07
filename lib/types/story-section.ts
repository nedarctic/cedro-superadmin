import { Story } from "./story";

export type StorySection = {
  id: string;
  sectionNumber: number;
  subtitle: string;
  content: string;
  storyId: string;
  story?: Story;
  createdAt: string;
  updatedAt: string;
}