<template>
  <div class="flex flex-col gap-4">
    <header>
      <h1 class="font-medium text-lg">{{ title }}</h1>
      <p v-if="description" class="text-sm text-slate-400">{{ description }}</p>
    </header>
    <main class="flex flex-col gap-2">
      <slot></slot>
    </main>
    <hr />
    <footer>
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  title: string;
  description?: string;
}>();
</script>

<style></style>
