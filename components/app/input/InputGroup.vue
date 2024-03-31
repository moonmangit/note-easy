<template>
  <div class="flex flex-col">
    <label class="text-sm">{{ label }}</label>
    <slot></slot>
    <div v-if="message" class="text-red-500 text-sm">
      <Icon name="mdi:asterisk" class="text-xs" />
      {{ message }}
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  label: string;
  message?: string;
}>();
</script>

<style></style>
