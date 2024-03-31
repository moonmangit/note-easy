<template>
  <ul for="note tags" class="flex flex-wrap gap-1">
    <li
      v-for="tag in tags"
      :key="tag.id"
      class="text-xs border border-slate-500 p-1 px-2 flex items-center hover:gap-1 group duration-300"
      :class="{
        'bg-slate-500 text-white': activeIds?.includes(tag.id),
      }"
      @click="emits('tag-clicked', tag.id)"
    >
      <section>
        {{ tag.name }}
      </section>
      <ul
        v-if="actions"
        class="flex gap-1 max-w-0 group-hover:max-w-[5rem] overflow-hidden duration-300"
      >
        <li v-for="(action, key) in actions" :key="key">
          <Icon
            :name="(action as any).iconName"
            @click="(action as any).handler(tag)"
          />
        </li>
      </ul>
    </li>
    <li v-if="withAdd" class="hover:bg-slate-200 border-dashed">+ tag</li>
  </ul>
</template>

<script lang="ts" setup generic="Actions extends {}">
type Tag = {
  id: string;
  name: string;
};
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
  (e: "tag-clicked", id: string): void;
  (e: "add"): void;
}>();
</script>

<style scoped>
ul[for="note tags"] {
  > li {
    @apply text-xs border border-slate-500 p-1 px-2 cursor-pointer;
  }
}
</style>
