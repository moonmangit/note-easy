<template>
  <Transition>
    <div
      v-if="modelValue"
      class="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-30"
    >
      <main class="p-4 bg-white w-[min(400px,80dvw)] relative">
        <slot></slot>

        <button
          class="absolute top-3 right-3"
          @click.prevent="modelValue = false"
        >
          <Icon name="mdi:close"></Icon>
        </button>
      </main>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
const modelValue = defineModel<boolean>({
  required: true,
});
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
