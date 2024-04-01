<template>
  <div
    class="grid grid-cols-[max-content_1fr] text-xs gap-x-3 gap-y-2 bg-slate-100 p-3"
  >
    <template v-for="(val, key) in meta" :key="key">
      <div class="capitalize font-medium">{{ key }}</div>
      <div class="text-right">{{ val }}</div>
    </template>
  </div>
</template>

<script lang="ts" setup>
type Meta = {
  title: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
};
const props = defineProps<{
  meta: Meta;
}>();
</script>

<style></style>
