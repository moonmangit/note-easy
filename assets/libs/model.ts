import type { Timestamp } from "firebase/firestore";

export type UserStamp = {
  id: string;
  name: string;
};

export type BaseRecord = {
  id: string;
  createdAt: Timestamp;
  createdBy: UserStamp;
  updatedAt: Timestamp;
  updatedBy: UserStamp;
};
