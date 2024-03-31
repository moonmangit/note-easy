import type { Timestamp } from "firebase/firestore";
import type { BaseRecord, UserStamp } from "../libs/model";

type ActionOps = "created" | "updated" | "deleted";
type Actions = `folder:${ActionOps}` | `note:${ActionOps}`;

export type NoteHistory = {
  id: string;
  action: Actions;
  targetNote: {
    id: string;
    fid: string;
    title: string;
  };
  at: Timestamp;
  by: UserStamp;
};

export type UserDoc = {
  folder: (BaseRecord & {
    title: string;
    notes: (BaseRecord & {
      title: string;
      content: {
        first: string;
        restChunk: {
          docPath: string;
          order: number;
        }[];
      };
    })[];
  })[];
  tags: {
    id: string;
    title: string;
  }[];
  history: NoteHistory[];
};
