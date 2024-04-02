<template>
  <div class="flex flex-col gap-1">
    <label class="text-sm">{{ label }}</label>
    <slot></slot>
    <Transition>
      <div v-if="message" class="text-red-500 text-sm">
        <Icon name="mdi:asterisk" class="text-xs" />
        {{ message }}
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  label: string;
  message?: string;
}>();
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  @apply duration-300;
}

.v-enter-from,
.v-leave-to {
  @apply opacity-0 -translate-y-2;
}
</style>
