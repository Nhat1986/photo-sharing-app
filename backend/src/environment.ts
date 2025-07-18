import { z } from "@hono/zod-openapi";


/**
 * This file contains the types of required environment variables.
 */
export type ENVS = {
  DB: D1Database;
  OBJECT_STORAGE: R2Bucket;
  R2_ACCESS_KEY_ID:string;
  R2_SECRET_ACCESS_KEY:string;
  BUCKET_NAME:string;
  ACCOUNT_ID:string;
}

// export const ROLES = [
//   "OWNER",
//   "CONTRIBUTOR",
//   "VIEWER"
// ];

export enum ROLES {
  OWNER = "OWNER",
  CONTRIBUTOR = "CONTRIBUTOR",
  VIEWER = "VIEWER"
}

export enum SUBSCRIPTIONS {
  FREE = "FREE",
  TIER_1 = "TIER_1",
  TIER_2 = "TIER_2"
}

export const emojiRegex =/^(?:[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F700}-\u{1F77F}]|[\u{1F780}-\u{1F7FF}]|[\u{1F800}-\u{1F8FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{2300}-\u{23FF}])$/u;
