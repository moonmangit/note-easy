<template>
  <div>
    <TransitionGroup
      name="list"
      tag="ul"
      for="note tags"
      class="flex flex-wrap gap-2 items-center"
    >
      <li
        v-for="tag in tags"
        :key="tag.id"
        class="text-xs border border-slate-500 p-1 px-2 flex items-center hover:gap-2 group duration-300"
        :class="{
          'bg-slate-500 text-white': activeIds?.includes(tag.id),
        }"
        @click="emits('tag-clicked', tag)"
      >
        <section>
          {{ tag.title }}
        </section>
        <ul
          v-if="actions"
          class="flex gap-1 max-w-0 group-hover:max-w-[5rem] overflow-hidden duration-300"
        >
          <li v-for="(action, key) in actions" :key="key">
            <Icon
              :name="(action as any).iconName"
              @click.stop="(action as any).handler(tag)"
            />
          </li>
        </ul>
      </li>
      <li
        v-if="withAdd"
        class="hover:bg-slate-200 border-dashed"
        @click="$emit('add')"
        key="add"
      >
        + tag
      </li>
      <li
        v-if="tags.length === 0 && !withAdd"
        key="empty"
        class="empty text-xs text-slate-400"
        title="back to folder to edit note's tags"
      >
        No tags
      </li>
    </TransitionGroup>
  </div>
</template>

<script lang="ts" setup generic="Actions extends {}">
import type { NoteTag } from "~/assets/models/user";

type Tag = NoteTag;
const props = defineProps<{
  tags: Tag[];
  activeIds?: string[];
  withAdd?: boolean;
  actions?: {
    [K in keyof Actions]: {
      iconName: string;
      handler: (tag: Tag) => void;
    };
  };
}>();

const emits = defineEmits<{
  (e: "tag-clicked", tag: Tag): void;
  (e: "add"): void;
}>();
</script>

<style scoped>
ul[for="note tags"] {
  > li:not(.empty) {
    @apply text-xs border border-slate-500 p-1 px-2 cursor-pointer;
  }
}

.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-active {
  position: absolute;
}
</style>
