<template>
  <div class="container mx-auto max-w-8xl px-4">
    <header class="flex justify-between items-center pb-4">
      <h1 class="text-xl font-bold py-4 text-slate-700">
        Notez <Icon name="mdi:pencil-circle-outline"></Icon>
      </h1>
      <section class="flex gap-1 items-center divide-x-2">
        <div
          class="w-10 rounded-full overflow-hidden relative border border-slate-500 mx-1"
        >
          <img :src="useAuth().getUserImageUrl" alt="" />
          <div class="bg-slate-800 absolute inset-[-2px] mix-blend-color" />
        </div>
        <section class="text-sm px-2">
          <h1>{{ useAuth().getProfileName }}</h1>
          <div class="flex justify-between">
            <button type="button" class="text-xs underline" @click="onLogout">
              Profile
            </button>
            <button type="button" class="text-xs underline" @click="onLogout">
              Logout
            </button>
          </div>
        </section>
      </section>
    </header>
    <main class="pb-8">
      <slot />
    </main>
  </div>
</template>

<script lang="ts" setup>
import { signOut } from "firebase/auth";

async function onLogout() {
  const { startLoading, stopLoading } = useAppLoading();
  try {
    startLoading();
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await signOut(useNuxtApp().$fb.auth);
    // clear
    useAuth().$patch({
      userDoc: null,
    });
    nextTick(() => {
      navigateTo("/login");
    });
  } catch (error) {
    console.error(error);
  } finally {
    stopLoading();
  }
}
</script>

<style></style>
