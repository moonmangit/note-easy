<template>
  <div class="flex flex-col gap-3">
    <header>
      <slot name="header">
        <h1 class="text-sm">{{ title }}</h1>
      </slot>
    </header>
    <main>
      <slot></slot>
    </main>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  title?: string;
}>();
</script>

<style></style>
