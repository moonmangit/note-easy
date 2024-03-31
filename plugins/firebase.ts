import { initializeApp } from "firebase/app";
import {
  connectAuthEmulator,
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { connectStorageEmulator, getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCaZUEpINJw15445Y9OkBodQGW-gk6ydOY",
  authDomain: "notez-e2410.firebaseapp.com",
  projectId: "notez-e2410",
  storageBucket: "notez-e2410.appspot.com",
  messagingSenderId: "1006811347530",
  appId: "1:1006811347530:web:b15d43766ff4310f1704b3",
};

export default defineNuxtPlugin(async (nuxtApp) => {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);
  const functions = getFunctions(app);

  if (process.env.NODE_ENV === "development") {
    connectAuthEmulator(auth, "http://localhost:9099", {
      disableWarnings: true,
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
