<template>
  <div class="fixed top-0 right-0">
    <TransitionGroup
      name="list"
      tag="ul"
      class="flex flex-col-reverse gap-2 p-2 z-10"
    >
      <li
        v-for="toast in toasts"
        :key="toast.id"
        class="flex gap-2 items-center bg-white p-3 whitespace-nowrap shadow-lg border border-slate-200"
      >
        <section :class="[typeConf[toast.type].textColorClass]">
          <Icon :name="typeConf[toast.type].iconName"></Icon>
        </section>
        <section class="flex flex-col gap-1 text-sm">
          <h1>{{ toast.title }}</h1>
          <p class="text-xs">{{ toast.message }}</p>
        </section>
      </li>
    </TransitionGroup>
  </div>
</template>

<script lang="ts" setup>
export type Toast = {
  id: string;
  title: string;
  message: string;
  type: "success" | "error";
};

const typeConf: Record<
  Toast["type"],
  {
    textColorClass: string;
    bgColorClass: string;
    iconName: string;
  }
> = {
  success: {
    textColorClass: "text-emerald-500",
    bgColorClass: "bg-emerald-100",
    iconName: "mdi:check-circle",
  },
  error: {
    textColorClass: "text-red-500",
    bgColorClass: "bg-red-100",
    iconName: "mdi:alert-circle",
  },
};

const props = defineProps<{
  toasts: Toast[];
}>();
</script>

<style scoped>
.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
</style>
