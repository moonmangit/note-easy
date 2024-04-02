import type { Request } from "express";
import { DecodedIdToken } from "firebase-admin/auth";

export type RequestAfterAuthCheck = Request & {
  decodedToken?: DecodedIdToken;
};
