<template>
  <ul class="text-xs flex flex-col gap-2">
    <li
      v-for="hist in histories.splice(0, 6)"
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
          {{ hist.targetNote.title }}
        </span>
      </section>
    </li>
  </ul>
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
</script>

<style></style>
