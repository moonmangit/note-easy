import { createProfileRouter } from "./routers/profile";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";
import { initializeApp } from "firebase-admin/app";
import { onRequest } from "firebase-functions/v2/https";
import * as express from "express";
// import * as logger from "firebase-functions/logger";
import authCheck from "./middlewares/authCheck";
import { getFirestore } from "firebase-admin/firestore";

const firebaseApp = initializeApp();
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);
const db = getFirestore(firebaseApp);
const profileRouter = createProfileRouter(auth, storage, db);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/profile", (...args) => authCheck(...args, { auth }), profileRouter);

export const v1 = onRequest(
  {
    region: "asia-east2",
    cors: true,
  },
  app
);
