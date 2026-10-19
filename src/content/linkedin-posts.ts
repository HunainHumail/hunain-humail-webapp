import type { LinkedInPost } from "@/lib/schemas/linkedinPost";

/**
 * Weekly LinkedIn posts for the Writing section (newest first).
 *
 * Refresh:
 * 1. Add the newest post at the top of `linkedinPosts`.
 * 2. Drop an optimized image in `/public/writing/<slug>.webp` (~1200w, webp q~80).
 * 3. Set `image` to `/writing/<slug>.webp`.
 *
 * The writing service merges these as type `post` and sorts newest first so
 * they render as the top cards. Talks and awards stay in seed/CMS below.
 */
export const linkedinPosts: LinkedInPost[] = [
  {
    title: "OpenAI DevDay Exchange — Community event, Dubai",
    date: "2026-10-16",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7516513022803222528/",
    image: "/writing/openai-devday-exchange.webp",
    alt: "OpenAI DevDay Exchange community event in Dubai",
    excerpt: "Notes from OpenAI DevDay Exchange in Dubai.",
  },
  {
    title: "AWS Summit Dubai",
    date: "2026-10-05",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7511116074516385792/",
    image: "/writing/aws-summit-dubai.webp",
    alt: "AWS Summit Dubai",
    excerpt: "Notes from AWS Summit Dubai.",
  },
  {
    title: "n8n × K2 Horizon hackathon — Dubai Future Accelerators",
    date: "2026-09-26",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7509671696283635712/",
    image: "/writing/n8n-k2-horizon-hackathon.webp",
    alt: "n8n and K2 Horizon hackathon at Dubai Future Accelerators",
    excerpt: "Notes from the n8n × K2 Horizon hackathon in Dubai.",
  },
];
