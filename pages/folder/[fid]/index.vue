<template>
  <div class="flex flex-col md:flex-row gap-10">
    <AppContentSection class="flex-1">
      <template #header>
        <div class="flex flex-col gap-2">
          <section>
            <button class="hover:underline" @click="navigateTo('/')">
              <Icon name="mdi:chevron-left" />
              <span>Back to My folders</span>
            </button>
          </section>
          <section class="flex justify-between text-sm">
            <section>
              <span class="text-slate-700 font-medium">Folder</span> /
              {{ folder?.title }}
            </section>
            <section class="flex gap-3">
              <button
                v-for="(conf, key) in sortConf"
                :key="key"
                class="hover:underline"
                :class="{
                  'font-bold': sortBy == key,
                }"
                @click="
                  {
                    sortBy = key;
                    currentPage = 1;
                  }
                "
              >
                <span>{{ conf.label }}</span>
                <Icon v-if="sortBy === key" :name="conf.iconName" />
              </button>
            </section>
          </section>
        </div>
      </template>
      <div class="flex flex-col gap-5">
        <PageFolderNoteList
          :notes="preparedNotes || []"
          :active-tag-ids="filterByTags.map((t) => t.id) || []"
          :folder-id="($route.params as any).fid"
        />
        <section for="paginate">
          <ul class="flex gap-2 justify-center">
            <li
              v-for="i in totalPage"
              :key="i"
              class="w-[30px] aspect-square flex items-center justify-center hover:bg-slate-500 hover:text-white cursor-pointer duration-300"
              :class="{
                'bg-slate-500 text-white': currentPage === i,
              }"
              @click="currentPage = i"
            >
              {{ i }}
            </li>
          </ul>
        </section>
      </div>
    </AppContentSection>
    <div for="aside" class="w-full md:w-[250px]">
      <div class="sticky top-4 flex flex-col gap-4">
        <AppContentSection title="Details">
          <AppMetaCard
            :meta="{
              title: folder?.title || '',
              createdAt: $dayjs(folder?.createdAt.toDate()).fromNow(),
              updatedAt: $dayjs(folder?.updatedAt.toDate()).fromNow(),
              createdBy: folder?.createdBy.name || '',
              updatedBy: folder?.updatedBy.name || '',
            }"
          ></AppMetaCard>
        </AppContentSection>
        <AppContentSection title="Tags (Select to filter)">
          <PageIndexTagList
            :tags="tags"
            :active-ids="filterByTags.map((t) => t.id)"
            with-add
            @add="tagCont.open('create')"
            @tag-clicked="toggleFilterByTag($event)"
            :actions="{
              edit: {
                iconName: 'mdi:pencil',
                handler: (tag) => {
                  tagCont.open('update', tag);
                },
              },
              delete: {
                iconName: 'mdi:delete',
                handler: (tag) => {
                  removeTag(tag);
                },
              },
            }"
          ></PageIndexTagList>
        </AppContentSection>
        <AppContentSection title="History">
          <PageIndexHistoryList :histories="hist || []" />
        </AppContentSection>
      </div>
    </div>

    <!-- Tag Modal -->
    <AppModal v-model="tagCont.modalActive.value">
      <AppModalForm :cont="tagCont" #="{ defineField, errors }">
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
  type NoteTag,
  type NoteTagSchema,
  noteTagSchema,
  noteTagModel,
} from "~/assets/models/user";

const folder = computed(() => {
  return useAuth().userDoc?.folder.find((f) => f.id === useRoute().params.fid);
});

// Prepare tags
const filterByTags = ref<NoteTag[]>([]);
function toggleFilterByTag(tag: NoteTag) {
  if (filterByTags.value.includes(tag)) {
    filterByTags.value = filterByTags.value.filter((t) => t !== tag);
  } else {
    filterByTags.value = [...filterByTags.value, tag];
  }
}
const tags = computed(() => {
  return useAuth().userDoc?.tags || [];
});
// Tag Controller
const tagCont = useModalForm<NoteTagSchema, NoteTag>({
  title: "Tag",
  schema: noteTagSchema,
  initialValues(record) {
    return {
      title: record?.title || "",
    };
  },
  handlers: {
    async create(values) {
      await noteTagModel.create(values);
    },
    async update(record, values) {
      await noteTagModel.update(record, values);
    },
  },
});
async function removeTag(tag: NoteTag) {
  if (!confirm("Are you sure to delete this tag?")) return;
  await noteTagModel.remove(tag);
}

// Prepare notes
const notes = computed(() => {
  let notes = folder.value?.notes || [];
  // filter by tags
  return (
    notes.filter((note) => {
      return filterByTags.value.every((tag) => note.tagIds.includes(tag.id));
    }) || []
  );
});
const { preparedNotes, currentPage, sortBy, sortConf, totalPage } =
  usePrepareItem(notes, 13, (a, b) => {
    return b.updatedAt.toDate().getTime() - a.updatedAt.toDate().getTime();
  });

// Prepare hist
const hist = computed(() => {
  let noteIds = folder.value?.notes.map((n) => n.id) || [];
  let folderId = folder.value?.id || "";
  return useAuth().userDoc?.history.filter((h) => {
    return h.target.id === folderId || noteIds.includes(h.target.id);
  });
});
</script>

<style></style>
