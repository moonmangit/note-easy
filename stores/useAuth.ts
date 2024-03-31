import type { User } from "firebase/auth";

export default defineStore("auth", () => {
  const profile = ref<User | null>(null);
  const isLoggedIn = computed(() => {
    return profile.value !== null;
  });
  const getUserImageUrl = computed(() => {
    return (
      profile.value?.photoURL ||
      `https://placehold.co/128x128?text=${
        profile.value?.displayName?.[0] || profile.value?.email?.[0] || "U"
      }`
    );
  });
  const getProfileName = computed(() => {
    return profile.value?.displayName || profile.value?.email || "Unknown";
  });

  function $reset() {
    profile.value = null;
  }

  return {
    profile,
    isLoggedIn,
    $reset,
    getUserImageUrl,
    getProfileName,
  };
});
