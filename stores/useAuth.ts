import { signOut, type User } from "firebase/auth";
import { Firestore, doc, onSnapshot, setDoc } from "firebase/firestore";
import type { UserStamp } from "~/assets/libs/model";
import { createUserDocRef, type UserDoc } from "~/assets/models/user";

export default defineStore("auth", () => {
  const profile = ref<User | null>(null);
  const userDoc = ref<UserDoc | null>(null);
  const unsubscribeUserDoc = ref<ReturnType<typeof onSnapshot> | null>(null);

  const isLoggedIn = computed(() => {
    return profile.value !== null;
  });
  const getUserImageUrl = computed(() => {
    return (
      profile.value?.photoURL ||
      `https://placehold.co/128x128?text=${(
        profile.value?.displayName?.[0] ||
        profile.value?.email?.[0] ||
        "U"
      ).toUpperCase()}`
    );
  });
  const getProfileName = computed(() => {
    return profile.value?.displayName || profile.value?.email || "Unknown";
  });

  async function fetchUser(db: Firestore) {
    if (!profile.value) return;
    const userDocRef = createUserDocRef();
    unsubscribeUserDoc.value = onSnapshot(userDocRef, async (doc) => {
      if (!doc.exists()) {
        await setDoc(userDocRef, {
          folder: [],
          history: [],
          tags: [],
        } as UserDoc);
      } else {
        userDoc.value = doc.data() as UserDoc;
      }
    });
  }
  function $reset() {
    profile.value = null;
  }
  function createUserStamp(): UserStamp {
    return {
      id: profile.value?.uid || "",
      name: profile.value?.displayName || profile.value?.email || "Unknown",
    };
  }
  async function logout() {
    await signOut(useNuxtApp().$fb.auth);
    unsubscribeUserDoc.value?.();
    nextTick(() => {
      navigateTo("/login");
    });
    $reset();
  }
  return {
    profile,
    userDoc,
    unsubscribeUserDoc,
    isLoggedIn,
    $reset,
    getUserImageUrl,
    getProfileName,
    fetchUser,
    createUserStamp,
    logout,
  };
});
