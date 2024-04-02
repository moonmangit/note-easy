<template>
  <div class="flex flex-col md:flex-row gap-10">
    <AppContentSection class="flex-1">
      <template #header>
        <div
          class="flex justify-between text-sm border-b-[1px] border-slate-200 pb-2"
        >
          <section>My Folders</section>
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
        </div>
      </template>
      <div class="flex flex-col gap-5">
        <PageIndexFolderList :folders="preparedFolders || []" />
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
    <div class="w-full md:w-[250px]">
      <div class="sticky top-4 flex flex-col gap-4">
        <AppContentSection title="History">
          <PageIndexHistoryList :histories="useAuth().userDoc?.history || []" />
        </AppContentSection>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const folder = computed(() => {
  return useAuth().userDoc?.folder || [];
});
const {
  preparedItems: preparedFolders,
  currentPage,
  sortBy,
  sortConf,
  totalPage,
} = usePrepareItem(folder, (a, b) => {
  return b.updatedAt.toDate().getTime() - a.updatedAt.toDate().getTime();
});
</script>

<style></style>
