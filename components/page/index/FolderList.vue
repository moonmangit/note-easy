<template>
  <div>
    <TransitionGroup
      name="list"
      tag="ul"
      for="folder list"
      class="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4"
    >
      <li
        for="add"
        class="flex items-center justify-center gap-1"
        key="add"
        @click="cont.open('create')"
      >
        <Icon name="mdi:folder-plus" />
        <span>new Folder</span>
      </li>
      <li
        v-for="folder in folders"
        :key="folder.id"
        @click="navigateTo(`/folder/${folder.id}`)"
      >
        <div class="p-2 text-sm flex flex-col gap-1 h-full">
          <header class="flex flex-col gap-1">
            <section class="flex justify-between items-center">
              <h3 class="font-medium">{{ folder.title }}</h3>
              <section class="text-slate-400 flex gap-2">
                <button
                  class="text-xl hover:text-slate-500 duration-300"
                  @click.stop="removeFolder(folder)"
                >
                  <Icon name="mdi:delete"></Icon>
                </button>
                <button
                  class="text-xl hover:text-slate-500 duration-300"
                  @click.stop="cont.open('update', folder)"
                >
                  <Icon name="mdi:pencil"></Icon>
                </button>
              </section>
            </section>
          </header>
          <main
            class="whitespace-normal line-clamp-4 h-full flex items-center justify-center"
          >
            <div class="w-fit relative">
              <Icon name="mdi:note-multiple" class="text-3xl text-slate-400" />
              <span
                class="absolute bg-slate-500 text-white w-[15px] aspect-square rounded-full flex items-center justify-center -top-1 -right-1 text-xs"
                >{{ folder.notes.length }}</span
              >
            </div>
          </main>
          <footer>
            <p class="text-slate-400">
              {{ $dayjs(folder.updatedAt.toDate()).fromNow() }}
            </p>
          </footer>
        </div>
      </li>
    </TransitionGroup>

    <AppModal v-model="cont.modalActive.value">
      <AppModalForm :cont="cont" #="{ defineField, errors }">
        <AppInputGroup label="Title" :message="errors.title">
          <input
            type="text"
            placeholder="Title ..."
            v-model="defineField('title')[0].value"
          />
        </AppInputGroup>
      </AppModalForm>
    </AppModal>
  </div>
</template>

<script lang="ts" setup>
import {
  noteFolderSchema,
  type NoteFolder,
  type NoteFolderSchema,
  noteFolderModel,
} from "~/assets/models/user";

defineProps<{
  folders: NoteFolder[];
}>();

// Create controller
const cont = useModalForm<NoteFolderSchema, NoteFolder>({
  title: "Folder",
  schema: noteFolderSchema,
  initialValues(record) {
    return {
      title: record?.title || "",
    };
  },
  handlers: {
    async create(values) {
      await noteFolderModel.create(values);
    },
    async update(record, values) {
      await noteFolderModel.update(record, values);
    },
  },
});
async function removeFolder(target: NoteFolder) {
  if (!confirm("Are you sure to delete this folder?")) return;
  await noteFolderModel.remove(target);
}
</script>

<style scoped>
ul[for="folder list"] {
  > li {
    @apply h-[200px] bg-slate-200 border border-transparent;
    @apply hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-300 duration-300;
    @apply hover:border-slate-400 cursor-pointer;
  }
}

.list-move,
.list-enter-active,
.list-leave-active {
  @apply duration-300;
}

.list-enter-from,
.list-leave-to {
  @apply opacity-0;
}

.list-leave-active {
  @apply absolute;
}
</style>
