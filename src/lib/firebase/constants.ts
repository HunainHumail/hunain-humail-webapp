export const ADMIN_EMAIL = "hunainhumail786@gmail.com";

export const COLLECTIONS = {
  profile: "profile",
  story: "story",
  now: "now",
  work: "work",
  writing: "writing",
  settings: "settings",
  messages: "messages",
} as const;

export type ContentCollection = Exclude<
  (typeof COLLECTIONS)[keyof typeof COLLECTIONS],
  "messages"
>;

export const PROFILE_DOC_ID = "main";
export const SETTINGS_DOC_ID = "site";

export const FIREBASE_EMULATORS = {
  host: "127.0.0.1",
  firestorePort: 8080,
  authPort: 9099,
  storagePort: 9199,
  uiPort: 4000,
} as const;

export const STORAGE_IMAGES_PREFIX = "images";
export const STORAGE_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
