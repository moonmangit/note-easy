<template>
  <div>
    <TransitionGroup
      name="list"
      tag="ul"
      for="note list"
      class="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4"
    >
      <li
        for="add"
        key="add"
        class="flex items-center justify-center gap-1 !border-slate-400 border-dashed"
        @click="noteCont.open('create')"
      >
        <Icon name="mdi:book-plus" />
        <span>new Note</span>
      </li>
      <li
        v-for="note in notes"
        :key="note.id"
        @click="navigateTo(`/folder/${$route.params.fid}/note/${note.id}`)"
      >
        <div class="p-2 text-sm flex flex-col gap-1 h-full">
          <header class="flex flex-col gap-1">
            <section class="flex justify-between items-center">
              <h3 class="font-medium">{{ note.title }}</h3>
              <section class="text-slate-400 flex gap-2">
                <button
                  class="text-xl hover:text-slate-500 duration-300"
                  @click.stop="removeNote(note)"
                >
                  <Icon name="mdi:delete"></Icon>
                </button>
                <button
                  class="text-xl hover:text-slate-500 duration-300"
                  @click.stop="noteCont.open('update', note)"
                >
                  <Icon name="mdi:pencil"></Icon>
                </button>
              </section>
            </section>
            <PageIndexTagList
              :tags="tagsOfIds(note.tagIds)"
              :active-ids="activeTagIds"
            />
          </header>
          <main
            class="whitespace-normal line-clamp-4 flex-1"
            v-html="note.content.first"
          ></main>
          <footer>
            <p class="text-slate-400">
              {{ $dayjs(note.updatedAt.toDate()).fromNow() }}
            </p>
          </footer>
        </div>
      </li>
    </TransitionGroup>

    <!-- Note Modal -->
    <AppModal v-model="noteCont.modalActive.value">
      <AppModalForm
        :cont="noteCont"
        #="{ defineField, errors, values, setFieldValue }"
      >
        <AppInputGroup label="Title" :message="errors.title">
          <input
            type="text"
            placeholder="Title ..."
            class="app-input"
            v-model="defineField('title')[0].value"
          />
        </AppInputGroup>
        <AppInputGroup label="Tags (optional)" :key="errors.tagIds">
          <PageIndexTagList
            :tags="useAuth().userDoc?.tags || []"
            :active-ids="values.tagIds"
            @tag-clicked="
              (tag) => {
                const tagIds = values.tagIds;
                if (tagIds.includes(tag.id)) {
                  setFieldValue(
                    'tagIds',
                    tagIds.filter((id) => id !== tag.id)
                  );
                } else {
                  setFieldValue('tagIds', [...tagIds, tag.id]);
                }
              }
            "
          ></PageIndexTagList>
          <div
            v-if="!useAuth().userDoc?.tags.length"
            class="text-sm text-slate-400 flex gap-2 items-center"
          >
            <Icon name="mdi:tag"></Icon>
            <span>no tag available.</span>
          </div>
        </AppInputGroup>
      </AppModalForm>
    </AppModal>
  </div>
</template>

<script lang="ts" setup>
import {
  noteRecordSchema,
  type NoteRecord,
  type NoteRecordSchema,
  noteRecordModel,
} from "~/assets/models/user";

const props = defineProps<{
  folderId: string;
  notes: NoteRecord[];
  activeTagIds: string[];
}>();

const tagsOfIds = computed(() => (ids: string[]) => {
  let tags = useAuth().userDoc?.tags;
  return tags?.filter((tag) => ids.includes(tag.id)) || [];
});

// Note Controller
const noteCont = useModalForm<NoteRecordSchema, NoteRecord>({
  title: "Note",
  schema: noteRecordSchema,
  initialValues(record) {
    return {
      title: record?.title || "",
      tagIds: record?.tagIds || [],
      folderId: props.folderId,
    };
  },
  handlers: {
    async create(values) {
      await noteRecordModel.create(values);
    },
    async update(record, values) {
      await noteRecordModel.update(record, values);
    },
  },
});
async function removeNote(target: NoteRecord) {
  if (!confirm("Are you sure to delete this note?")) return;
  await noteRecordModel.remove(target);
}
</script>

<style scoped>
ul[for="note list"] {
  > li {
    @apply h-[200px] bg-slate-100 border border-transparent;
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
