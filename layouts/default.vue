<template>
  <div class="container mx-auto max-w-8xl px-4">
    <header class="flex justify-between items-center pb-4">
      <h1 class="text-xl font-bold py-4">
        Notez <Icon name="mdi:pencil-circle-outline"></Icon>
      </h1>
      <section class="flex gap-1 items-center">
        <div
          class="w-10 rounded-full overflow-hidden relative border border-slate-500"
        >
          <img :src="useAuth().getUserImageUrl" alt="" />
          <div class="bg-slate-800 absolute inset-[-2px] mix-blend-color" />
        </div>
        <h1>{{ useAuth().getProfileName }},</h1>
        <button
          class="text-xs border border-slate-500 p-1 px-2 flex items-center gap-1 h-fit"
          @click="onLogout"
        >
          <Icon name="mdi:logout"></Icon>
          <span>Logout</span>
        </button>
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
    await signOut(useNuxtApp().$fb.auth);
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
