<template>
  <div class="font-light text-slate-500">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <Transition name="loading">
      <section
        v-if="loadingActive"
        for="loading"
        class="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-30"
      >
        <div>
          <h1 class="text-4xl font-bold py-4 text-white animate-spin-y">
            Notez <Icon name="mdi:pencil-circle-outline"></Icon>
          </h1>
          <p class="text-slate-300 bg-slate-900/40 w-fit p-1 px-3 mx-auto">
            {{ loadingText }}
          </p>
        </div>
      </section>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onAuthStateChanged } from "firebase/auth";

const { loadingActive, loadingText, startLoading, stopLoading } =
  useAppLoading();

onMounted(async () => {
  onAuthStateChanged(useNuxtApp().$fb.auth, async (user) => {
    if (user) {
      startLoading();
      await useAuth().fetchUser(useNuxtApp().$fb.db);
      stopLoading();
    }
  });
});
</script>

<style scoped>
.animate-spin-y {
  animation: spinY 2s ease-out infinite;
}

@keyframes spinY {
  0% {
    transform: rotateY(0deg);
  }
  100% {
    transform: rotateY(360deg);
  }
}

.loading-enter-active,
.loading-leave-active {
  transition: opacity 0.5s ease;
}

.loading-enter-from,
.loading-leave-to {
  opacity: 0;
}
</style>

<style>
.page-enter-active,
.page-leave-active {
  @apply duration-300;
}
.page-enter-from,
.page-leave-to {
  @apply opacity-0 -translate-y-1;
}
</style>
