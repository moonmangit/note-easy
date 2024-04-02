import * as logger from "firebase-functions/logger";
import type { Response, NextFunction } from "express";
import type { Auth } from "firebase-admin/auth";
import { RequestAfterAuthCheck } from "../libs/request";

export default async function (
  req: RequestAfterAuthCheck,
  res: Response,
  next: NextFunction,
  context: {
    auth: Auth;
  }
): Promise<void> {
  const { auth } = context;

  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer ")
  ) {
    logger.error("No bearer token found!");
    res.status(403).json({
      message: "Unauthorized",
    });
    return;
  }

  const bearerToken = req.headers.authorization.split("Bearer ")[1];
  try {
    const decodedToken = await auth.verifyIdToken(bearerToken);
    req.decodedToken = decodedToken;
  } catch (error) {
    logger.error("Invalid token!", error);
    res.status(403).json({
      message: "Unauthorized",
    });
    return;
  }

  next();
}
