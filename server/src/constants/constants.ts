export const POST_LIMIT = 25;
export const POST_STATUS = ["draft", "published", "archived"] as const;
export const AVG_READ_RATE = 200; // wpm
export const USER_ROLES = ["user", "admin", "author"] as const;
export const USER_STATUS = ["active", "deactive", "pending"] as const;
export const PREFERENCES_THEMES = ["light", "dark"] as const;
export const CATEGORY_LIMIT = 100;
export const TAG_LIMIT = 100;
export const COMMENT_LIMIT = 100;
export const LOGIN_PROVIDER_OPTIONS = ["google", "email", "github"] as const;
export const IMAGE_FORMATS = ["jpeg", "png", "jpg"] as const;
export const POST_FLAGS = [
  "popular",
  "editors_pick",
  "trending",
  "sponsored",
  "exclusive",
] as const;
