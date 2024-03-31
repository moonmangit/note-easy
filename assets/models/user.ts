import * as yup from "yup";
import {
  doc,
  runTransaction,
  Timestamp,
  Transaction,
} from "firebase/firestore";
import type { BaseRecord, UserStamp } from "../libs/model";

type ActionOps = "created" | "updated" | "deleted";
type Actions = `folder:${ActionOps}` | `note:${ActionOps}`;
export type { Actions as NoteHistoryActions };

// Helper
export function createUserDocRef() {
  return doc(useNuxtApp().$fb.db, `users/${useAuth().profile?.uid || ""}`);
}

// Note History
export type NoteHistoryTarget = {
  // represent the folder or note id
  id: string;
  title: string;
};
export type NoteHistory = {
  id: string;
  action: Actions;
  target: NoteHistoryTarget;
  at: Timestamp;
  by: UserStamp;
};
export const noteHistoryModel = {
  create(tsc: Transaction, action: Actions, target: NoteHistoryTarget) {
    return {
      id: randomString(12),
      action,
      at: Timestamp.now(),
      by: useAuth().createUserStamp(),
      target,
    };
  },
};

// Note Record
export type NoteRecord = BaseRecord & {
  title: string;
  content: {
    first: string;
    restChunk: {
      docPath: string;
      order: number;
    }[];
  };
  tagIds: string[];
};

// Note Folder
type NoteFolder = BaseRecord & {
  title: string;
  notes: NoteRecord[];
};
const noteFolderSchema = yup.object().shape({
  title: yup.string().required(),
});
type NoteFolderSchema = yup.InferType<typeof noteFolderSchema>;
const noteFolderModel = {
  async create(values: NoteFolderSchema) {
    const { db } = useNuxtApp().$fb;
    const userDocRef = createUserDocRef();
    await runTransaction(db, async (tsc) => {
      const doc = (await tsc.get(userDocRef)).data() as UserDoc;
      if (!doc) {
        throw new Error("User document not found");
      }
      const targetFolder: NoteFolder = {
        id: randomString(12),
        title: values.title,
        notes: [],
        createdAt: Timestamp.now(),
        createdBy: useAuth().createUserStamp(),
        updatedAt: Timestamp.now(),
        updatedBy: useAuth().createUserStamp(),
      };
      doc.folder.push(targetFolder);
      doc.history.push({
        id: randomString(12),
        action: "folder:created",
        at: Timestamp.now(),
        by: useAuth().createUserStamp(),
        target: {
          id: targetFolder.id,
          title: targetFolder.title,
        },
      });
      tsc.set(userDocRef, doc);
    });
  },
  async update(target: NoteFolder, value: NoteFolderSchema) {
    const { db } = useNuxtApp().$fb;
    const userDocRef = createUserDocRef();
    await runTransaction(db, async (tsc) => {
      const doc = (await tsc.get(userDocRef)).data() as UserDoc;
      if (!doc) {
        throw new Error("User document not found");
      }
      const targetIndex = doc.folder.findIndex((f) => f.id === target.id);
      if (targetIndex === -1) {
        throw new Error("Folder not found");
      }
      const targetFolder = doc.folder[targetIndex];
      targetFolder.title = value.title;
      targetFolder.updatedAt = Timestamp.now();
      targetFolder.updatedBy = useAuth().createUserStamp();
      doc.history.push({
        id: randomString(12),
        action: "folder:updated",
        at: Timestamp.now(),
        by: useAuth().createUserStamp(),
        target: {
          id: targetFolder.id,
          title: targetFolder.title,
        },
      });
      tsc.set(userDocRef, doc);
    });
  },
  async remove(target: Omit<NoteFolder, "notes">) {
    const { db } = useNuxtApp().$fb;
    const userDocRef = createUserDocRef();
    await runTransaction(db, async (tsc) => {
      const doc = (await tsc.get(userDocRef)).data() as UserDoc;
      if (!doc) {
        throw new Error("User document not found");
      }
      const targetIndex = doc.folder.findIndex((f) => f.id === target.id);
      if (targetIndex === -1) {
        throw new Error("Folder not found");
      }
      const targetFolder = doc.folder[targetIndex];
      doc.folder.splice(targetIndex, 1);
      doc.history.push({
        id: randomString(12),
        action: "folder:deleted",
        at: Timestamp.now(),
        by: useAuth().createUserStamp(),
        target: {
          id: targetFolder.id,
          title: targetFolder.title,
        },
      });
      tsc.set(userDocRef, doc);
    });
  },
};
export { noteFolderSchema, noteFolderModel };
export type { NoteFolderSchema, NoteFolder };

// Note Tag
export type NoteTag = BaseRecord & {
  id: string;
  title: string;
};

// User Document
export type UserDoc = {
  folder: NoteFolder[];
  tags: NoteTag[];
  history: NoteHistory[];
};
