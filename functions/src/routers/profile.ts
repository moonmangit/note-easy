import { Router } from "express";
import type { Auth } from "firebase-admin/auth";
import { getDownloadURL } from "firebase-admin/storage";
import type { Storage } from "firebase-admin/storage";
import type { Firestore } from "firebase-admin/firestore";

export function createProfileRouter(
  auth: Auth,
  storage: Storage,
  db: Firestore
) {
  const router = Router();
  router.get("/", (req, res) => {
    res.json({
      message: `Profile list fetched successfully!`,
    });
  });
  router.patch("/:uid", async (req, res) => {
    const uid = req.params.uid;
    try {
      const profileFile = storage.bucket().file(`profile/${uid}`);
      if (req.body.photoBase64) {
        const base64Data = req.body.photoBase64.split(",")[1] || "";
        await profileFile.save(Buffer.from(base64Data, "base64"), {
          contentType: "image/jpeg",
        });
      }
      const user = await auth.updateUser(uid, {
        displayName: req.body.displayName || undefined,
        photoURL: req.body.photoBase64
          ? await getDownloadURL(profileFile)
          : undefined,
        password: req.body.password || undefined,
      });
      res.json({
        message: `Profile for user ${uid} updated successfully!`,
        data: {
          user,
        },
      });
    } catch (error: any) {
      res.json({
        message: `Failed to update profile for user ${uid}, ${error.message}`,
      });
    }
  });
  router.delete("/:uid", async (req, res) => {
    const uid = req.params.uid;
    try {
      await auth.deleteUser(uid);
      // Clear all storage
      const profileFile = storage.bucket().file(`profile/${uid}`);
      await profileFile.delete();
      // Clear all chunks
      const profileDoc = db.doc("users/" + uid);
      const allNotes = (
        ((await profileDoc.get()).data() as any).folder as []
      ).flatMap((folder: any) => folder.notes);
      const allChunks: {
        docPath: string;
        order: number;
      }[] = allNotes.flatMap((note: any) => note.content.restChunk);
      const batch = db.batch();
      allChunks.forEach((chunk) => {
        batch.delete(db.doc(chunk.docPath));
      });
      await batch.commit();
      // Delete the document
      await profileDoc.delete();
      res.json({
        message: `Profile for user ${uid} deleted successfully!`,
      });
    } catch (error: any) {
      res.json({
        message: `Failed to delete profile for user ${uid}, ${error.message}`,
      });
    }
  });

  return router;
}
