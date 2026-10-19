import type { NowItem } from "@/lib/schemas/now";
import type { Profile } from "@/lib/schemas/profile";
import type { SiteSettings } from "@/lib/schemas/siteSettings";
import type { StoryItem } from "@/lib/schemas/story";
import type { WorkItem } from "@/lib/schemas/work";
import type { Testimonial } from "@/lib/schemas/testimonial";
import type { WritingItem } from "@/lib/schemas/writing";
import { COLLECTIONS } from "../constants";
import { createCollectionRepository } from "./collectionRepository";

export {
  createCollectionRepository,
  type CollectionRepository,
} from "./collectionRepository";
export {
  messagesRepository,
  type ContactMessageDoc,
  type MessagesRepository,
} from "./messagesRepository";
export {
  createCliSession,
  type CliSessionCreateInput,
} from "./cliSessionsRepository";

export const profileRepository =
  createCollectionRepository<Profile>(COLLECTIONS.profile);
export const settingsRepository =
  createCollectionRepository<SiteSettings>(COLLECTIONS.settings);
export const storyRepository =
  createCollectionRepository<StoryItem>(COLLECTIONS.story);
export const nowRepository =
  createCollectionRepository<NowItem>(COLLECTIONS.now);
export const workRepository =
  createCollectionRepository<WorkItem>(COLLECTIONS.work);
export const writingRepository =
  createCollectionRepository<WritingItem>(COLLECTIONS.writing);
export const testimonialsRepository =
  createCollectionRepository<Testimonial>(COLLECTIONS.testimonials);
