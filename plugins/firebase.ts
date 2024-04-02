import { initializeApp } from "firebase/app";
import {
  connectAuthEmulator,
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { connectStorageEmulator, getStorage } from "firebase/storage";

export default defineNuxtPlugin(async (nuxtApp) => {
  const app = initializeApp(nuxtApp.$config.public.firebase);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);
  const functions = getFunctions(app);

  if (process.env.NODE_ENV === "development") {
    connectAuthEmulator(auth, "http://localhost:9099", {
      disableWarnings: false,
    });
    connectFirestoreEmulator(db, "localhost", 8080);
    connectStorageEmulator(storage, "localhost", 9199);
    connectFunctionsEmulator(functions, "localhost", 5001);
  }

  await new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        useAuth().$patch({
          profile: user,
        });
      } else {
        useAuth().$reset();
      }
      resolve(null);
    });
  });

  return {
    provide: {
      fb: {
        auth,
        db,
        storage,
        functions,
      },
    },
  };
});
