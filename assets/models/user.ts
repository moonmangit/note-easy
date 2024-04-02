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

// Note Chunks
export type NoteChunk = {
  content: string;
  uid: string;
};

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
type NoteRecord = BaseRecord & {
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
const noteRecordSchema = yup.object().shape({
  title: yup.string().required(),
  tagIds: yup.array().of(yup.string().required()).default([]),
  content: yup.string(),
  folderId: yup.string().required(),
});
type NoteRecordSchema = yup.InferType<typeof noteRecordSchema>;
const noteRecordModel = {
  async create(values: NoteRecordSchema) {
    const { db } = useNuxtApp().$fb;
    const userDocRef = createUserDocRef();
    await runTransaction(db, async (tsc) => {
      const doc = (await tsc.get(userDocRef)).data() as UserDoc;
      if (!doc) {
        throw new Error("User document not found");
      }
      const targetFolderIndex = doc.folder.findIndex(
        (f) => f.id === values.folderId
      );
      if (targetFolderIndex === -1) {
        throw new Error("Folder not found");
      }
      const targetNote: NoteRecord = {
        id: randomString(12),
        title: values.title,
        content: {
          first: "",
          restChunk: [],
        },
        tagIds: values.tagIds || [],
        createdAt: Timestamp.now(),
        createdBy: useAuth().createUserStamp(),
        updatedAt: Timestamp.now(),
        updatedBy: useAuth().createUserStamp(),
      };
      doc.folder[targetFolderIndex].notes.push(targetNote);
      doc.history.push(
        noteHistoryModel.create(tsc, "note:created", {
          id: targetNote.id,
          title: targetNote.title,
        })
      );
      tsc.set(userDocRef, doc);
    });
  },
  async update(target: NoteRecord, value: NoteRecordSchema) {
    const { db } = useNuxtApp().$fb;
    const userDocRef = createUserDocRef();
    await runTransaction(db, async (tsc) => {
      const doc = (await tsc.get(userDocRef)).data() as UserDoc;
      if (!doc) {
        throw new Error("User document not found");
      }
      const targetFolderIndex = doc.folder.findIndex((f) =>
        f.notes.some((n) => n.id === target.id)
      );
      if (targetFolderIndex === -1) {
        throw new Error("Note not found");
      }
      const targetFolder = doc.folder[targetFolderIndex];
      const targetNoteIndex = targetFolder.notes.findIndex(
        (n) => n.id === target.id
      );
      if (targetNoteIndex === -1) {
        throw new Error("Note not found");
      }
      targetFolder.updatedAt = Timestamp.now();
      targetFolder.updatedBy = useAuth().createUserStamp();
      const targetNote = targetFolder.notes[targetNoteIndex];
      targetNote.title = value.title;
      targetNote.tagIds = value.tagIds;
      targetNote.updatedAt = Timestamp.now();
      targetNote.updatedBy = useAuth().createUserStamp();
      doc.history.push(
        noteHistoryModel.create(tsc, "note:updated", {
          id: targetNote.id,
          title: targetNote.title,
        })
      );
      tsc.set(userDocRef, doc);
    });
  },
  async updateContent(target: NoteRecord, content: string) {
    const firstChunkSize = 100;
    const perChunkSize = 1000;
    const { db } = useNuxtApp().$fb;
    const userDocRef = createUserDocRef();
    const chunkCount = Math.ceil(content.length / perChunkSize);
    const firstChunk = content.slice(0, firstChunkSize);
    const restChunks = Array.from({ length: chunkCount - 1 }).map((_, i) => {
      const start = firstChunkSize + i * perChunkSize;
      return content.slice(start, start + perChunkSize);
    });
    const chunks: {
      docPath: string;
      order: number;
      content: string;
    }[] = restChunks.map((str, i) => ({
      docPath: `chunks/${randomString(12)}`,
      order: i,
      content: str,
    }));
    await runTransaction(db, async (tsc) => {
      const userDoc = (await tsc.get(userDocRef)).data() as UserDoc;
      if (!userDoc) {
        throw new Error("User document not found");
      }
      const targetFolderIndex = userDoc.folder.findIndex((f) =>
        f.notes.some((n) => n.id === target.id)
      );
      if (targetFolderIndex === -1) {
        throw new Error("Note not found");
      }
      const targetFolder = userDoc.folder[targetFolderIndex];
      targetFolder.updatedAt = Timestamp.now();
      targetFolder.updatedBy = useAuth().createUserStamp();
      const targetNoteIndex = targetFolder.notes.findIndex(
        (n) => n.id === target.id
      );
      if (targetNoteIndex === -1) {
        throw new Error("Note not found");
      }
      const targetNote = targetFolder.notes[targetNoteIndex];
      targetNote.content.first = firstChunk;
      // remove old chunks
      if (targetNote.content.restChunk) {
        targetNote.content.restChunk.forEach((c) => {
          tsc.delete(doc(useNuxtApp().$fb.db, c.docPath));
        });
      }
      // create new chunks
      if (chunks.length > 0) {
        let chunkDoc: NoteChunk = {
          content: chunks[0].content,
          uid: useAuth().profile?.uid || "",
        };
        chunks.forEach((c) => {
          tsc.set(doc(useNuxtApp().$fb.db, c.docPath), chunkDoc);
        });
      }
      // set doc
      targetNote.content.restChunk = chunks.map((c) => ({
        docPath: c.docPath,
        order: c.order,
      }));
      // update note
      targetNote.updatedAt = Timestamp.now();
      targetNote.updatedBy = useAuth().createUserStamp();
      userDoc.history.push(
        noteHistoryModel.create(tsc, "note:updated", {
          id: targetNote.id,
          title: targetNote.title,
        })
      );
      tsc.set(userDocRef, userDoc);
    });
  },
  async remove(target: NoteRecord) {
    const { db } = useNuxtApp().$fb;
    const userDocRef = createUserDocRef();
    await runTransaction(db, async (tsc) => {
      const userDoc = (await tsc.get(userDocRef)).data() as UserDoc;
      if (!userDoc) {
        throw new Error("User document not found");
      }
      const targetFolderIndex = userDoc.folder.findIndex((f) =>
        f.notes.some((n) => n.id === target.id)
      );
      if (targetFolderIndex === -1) {
        throw new Error("Note not found");
      }
      const targetFolder = userDoc.folder[targetFolderIndex];
      targetFolder.updatedAt = Timestamp.now();
      targetFolder.updatedBy = useAuth().createUserStamp();
      const targetNoteIndex = targetFolder.notes.findIndex(
        (n) => n.id === target.id
      );
      if (targetNoteIndex === -1) {
        throw new Error("Note not found");
      }
      const targetNote = targetFolder.notes[targetNoteIndex];
      targetFolder.notes.splice(targetNoteIndex, 1);
      userDoc.history.push(
        noteHistoryModel.create(tsc, "note:deleted", {
          id: targetNote.id,
          title: targetNote.title,
        })
      );
      // Remove content chunks
      if (targetNote.content.restChunk) {
        targetNote.content.restChunk.forEach((c) => {
          tsc.delete(doc(useNuxtApp().$fb.db, c.docPath));
        });
      }
      tsc.set(userDocRef, userDoc);
    });
  },
};
export { noteRecordSchema, noteRecordModel };
export type { NoteRecord, NoteRecordSchema };

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
export const noteTagSchema = yup.object().shape({
  title: yup.string().required(),
});
export type NoteTagSchema = yup.InferType<typeof noteTagSchema>;
export const noteTagModel = {
  async create(values: NoteTagSchema) {
    const { db } = useNuxtApp().$fb;
    const userDocRef = createUserDocRef();
    await runTransaction(db, async (tsc) => {
      const doc = (await tsc.get(userDocRef)).data() as UserDoc;
      if (!doc) {
        throw new Error("User document not found");
      }
      const targetTag: NoteTag = {
        id: randomString(12),
        title: values.title,
        createdAt: Timestamp.now(),
        createdBy: useAuth().createUserStamp(),
        updatedAt: Timestamp.now(),
        updatedBy: useAuth().createUserStamp(),
      };
      doc.tags.push(targetTag);
      tsc.set(userDocRef, doc);
    });
  },
  async update(target: NoteTag, value: NoteTagSchema) {
    const { db } = useNuxtApp().$fb;
    const userDocRef = createUserDocRef();
    await runTransaction(db, async (tsc) => {
      const doc = (await tsc.get(userDocRef)).data() as UserDoc;
      if (!doc) {
        throw new Error("User document not found");
      }
      const targetIndex = doc.tags.findIndex((t) => t.id === target.id);
      if (targetIndex === -1) {
        throw new Error("Tag not found");
      }
      const targetTag = doc.tags[targetIndex];
      targetTag.title = value.title;
      targetTag.updatedAt = Timestamp.now();
      targetTag.updatedBy = useAuth().createUserStamp();
      tsc.set(userDocRef, doc);
    });
  },
  async remove(target: NoteTag) {
    const { db } = useNuxtApp().$fb;
    const userDocRef = createUserDocRef();
    await runTransaction(db, async (tsc) => {
      const doc = (await tsc.get(userDocRef)).data() as UserDoc;
      if (!doc) {
        throw new Error("User document not found");
      }
      const targetIndex = doc.tags.findIndex((t) => t.id === target.id);
      if (targetIndex === -1) {
        throw new Error("Tag not found");
      }
      doc.tags.splice(targetIndex, 1);
      // remove tag from notes
      doc.folder.forEach((f) => {
        f.notes.forEach((n) => {
          const tagIndex = n.tagIds.indexOf(target.id);
          if (tagIndex !== -1) {
            n.tagIds.splice(tagIndex, 1);
          }
        });
      });
      tsc.set(userDocRef, doc);
    });
  },
};

// User Document
export type UserDoc = {
  folder: NoteFolder[];
  tags: NoteTag[];
  history: NoteHistory[];
};
