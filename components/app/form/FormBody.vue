<template>
  <div class="flex flex-col gap-2">
    <header>
      <h1>{{ title }}</h1>
      <p v-if="description">{{ description }}</p>
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
