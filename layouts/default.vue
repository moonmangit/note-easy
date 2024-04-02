<template>
  <div class="container mx-auto max-w-8xl">
    <header
      class="flex justify-between items-center sticky lg:static top-0 bg-white z-10 px-4"
    >
      <h1 class="text-xl font-bold py-4 text-slate-700">
        Notez <Icon name="mdi:pencil-circle-outline"></Icon>
      </h1>
      <section class="flex gap-1 items-center divide-x-2">
        <div class="w-10 h-10 rounded-full overflow-hidden relative mx-1">
          <img
            class="w-full h-full object-cover"
            :src="useAuth().getUserImageUrl"
            alt=""
          />
        </div>
        <section class="text-sm px-2">
          <h1 class="text-slate-700 font-medium text-end">
            {{ useAuth().getProfileName }}
          </h1>
          <div class="flex justify-between gap-4">
            <button
              type="button"
              class="text-xs underline"
              @click="navigateTo('/profile')"
            >
              Profile
            </button>
            <button type="button" class="text-xs underline" @click="onLogout">
              Logout
            </button>
          </div>
        </section>
      </section>
    </header>
    <main class="pb-8 mt-4 px-4">
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
    await signOut(useNuxtApp().$fb.auth);
    // clear
    useAuth().logout();
  } catch (error) {
    console.error(error);
  } finally {
    stopLoading();
  }
}
</script>

<style></style>
