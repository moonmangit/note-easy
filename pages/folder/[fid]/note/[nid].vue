<template>
  <div class="flex flex-col md:flex-row gap-10">
    <AppContentSection class="flex-1">
      <template #header>
        <div class="flex flex-col gap-2">
          <section>
            <button
              class="hover:underline"
              @click="navigateTo(`/folder/${$route.params.fid}`)"
            >
              <Icon name="mdi:chevron-left" />
              <span>Back to Folder "{{ $route.params.fid }}"</span>
            </button>
          </section>
          <section class="flex justify-between text-sm">
            <section class="text-2xl">My Folder Name is 1</section>
            <section>
              <button class="app-button">Save</button>
            </section>
          </section>
        </div>
      </template>

      <div class="flex flex-col gap-5">
        <div class="h-[70dvh] pb-8">
          <QuillEditor />
        </div>
      </div>
    </AppContentSection>
    <div for="aside" class="w-full md:w-[250px]">
      <div class="sticky top-4 flex flex-col gap-4">
        <AppContentSection :title="`Details ${$route.params.fid}`">
          <AppMetaCard
            :meta="{
              title: 'Folder Title',
              createdAt: '2021-09-01',
              createdBy: 'John Doe',
              updatedAt: '2021-09-01',
              updatedBy: 'John Doe',
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
          <PageIndexHistoryList :histories="histories" />
        </AppContentSection>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Timestamp } from "firebase/firestore";
import type { AppHistory } from "~/components/page/index/HistoryList.vue";

const histories = ref(
  (() => {
    let arr: AppHistory[] = [];
    for (let i = 0; i < 10; i++) {
      arr.push({
        id: randomString(12),
        action: randomFromArray([
          "note:created",
          "note:updated",
          "note:deleted",
        ]),
        at: Timestamp.now(),
        by: {
          id: randomString(12),
          name: randomFromArray(["John Doe", "Jane Doe"]),
        },
        targetNote: {
          id: randomString(12),
          fid: randomString(12),
          title: randomFromArray([
            "My First Note",
            "My Second Note",
            "My Third Note",
          ]),
        },
      });
    }
    return arr;
  })()
);
</script>

<style></style>
