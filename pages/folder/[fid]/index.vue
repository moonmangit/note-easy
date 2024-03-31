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
              <button class="hover:underline">
                <span>Oldest</span>
                <Icon name="mdi:arrow-down" />
              </button>
              <button class="hover:underline">
                <span>Latest</span>
                <Icon name="mdi:arrow-up" />
              </button>
            </section>
          </section>
        </div>
      </template>
      <div class="flex flex-col gap-5">
        <PageFolderNoteList />
        <section for="paginate">
          <ul class="flex gap-2 justify-center">
            <li
              v-for="i in 5"
              :key="i"
              class="w-[30px] aspect-square flex items-center justify-center hover:bg-slate-500 hover:text-white cursor-pointer duration-300"
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
        <AppContentSection title="Tags">
          <PageIndexTagList
            :tags="[
              {
                id: randomString(12),
                name: 'Tag 1',
              },
              {
                id: randomString(12),
                name: 'Tag 2',
              },
              {
                id: randomString(12),
                name: 'Tag 3',
              },
            ]"
            :active-ids="[]"
            with-add
          ></PageIndexTagList>
        </AppContentSection>
        <AppContentSection title="History">
          <PageIndexHistoryList :histories="hist || []" />
        </AppContentSection>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { NoteHistoryActions } from "~/assets/models/user";

const folder = computed(() => {
  return useAuth().userDoc?.folder.find((f) => f.id === useRoute().params.fid);
});

// Prepare hist
const hist = computed(() => {
  return useAuth().userDoc?.history.filter(
    (hist) => hist.target.id === useRoute().params.fid
  );
});
</script>

<style></style>
