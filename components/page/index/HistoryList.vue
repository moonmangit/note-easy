<template>
  <TransitionGroup tag="ul" name="list" class="text-xs flex flex-col gap-2">
    <li
      v-for="hist in sortedHistories.slice(0, 7)"
      :key="hist.id"
      class="flex p-2 gap-2 items-center bg-slate-100"
    >
      <section class="mb-auto">
        <span
          class="text-xs font-bold"
          :class="actionConf[hist.action].textColorClass"
        >
          <icon :name="actionConf[hist.action].iconName" />
        </span>
      </section>
      <section class="flex flex-col">
        <span class="text-xs text-gray-500">{{
          $dayjs(hist.at.toDate()).fromNow()
        }}</span>
        <span class="text-xs">
          {{ actionConf[hist.action].displayName }} :
          {{ hist.target.title }}
        </span>
      </section>
    </li>
  </TransitionGroup>
</template>

<script lang="ts" setup>
import type { NoteHistory } from "~/assets/models/user";

export type AppHistory = NoteHistory;

const actionConf: Record<
  AppHistory["action"],
  {
    displayName: string;
    textColorClass: string;
    bgColorClass: string;
    iconName: string;
  }
> = {
  "folder:created": {
    displayName: "Folder created",
    textColorClass: "text-green-500",
    bgColorClass: "bg-green-100",
    iconName: "mdi:folder-plus",
  },
  "folder:updated": {
    displayName: "Folder updated",
    textColorClass: "text-blue-500",
    bgColorClass: "bg-blue-100",
    iconName: "mdi:folder-edit",
  },
  "folder:deleted": {
    displayName: "Folder deleted",
    textColorClass: "text-red-500",
    bgColorClass: "bg-red-100",
    iconName: "mdi:folder-remove",
  },
  "note:created": {
    displayName: "Note created",
    textColorClass: "text-green-500",
    bgColorClass: "bg-green-100",
    iconName: "mdi:note-plus",
  },
  "note:updated": {
    displayName: "Note updated",
    textColorClass: "text-blue-500",
    bgColorClass: "bg-blue-100",
    iconName: "mdi:note-edit",
  },
  "note:deleted": {
    displayName: "Note deleted",
    textColorClass: "text-red-500",
    bgColorClass: "bg-red-100",
    iconName: "mdi:note-remove",
  },
};

const props = defineProps<{
  histories: AppHistory[];
}>();

const sortedHistories = computed(() =>
  props.histories.sort((a, b) => b.at.toMillis() - a.at.toMillis())
);
</script>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  @apply duration-300;
}

.list-enter-from,
.list-leave-to {
  @apply opacity-0 translate-x-2;
}

.list-leave-active {
  @apply absolute;
}
</style>
