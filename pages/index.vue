<template>
  <div class="flex flex-col md:flex-row gap-10">
    <AppContentSection class="flex-1">
      <template #header>
        <div class="flex justify-between text-sm">
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
// paginate
const perPage = 13;
const currentPage = ref(1);
const totalPage = computed(() => {
  return Math.ceil((useAuth().userDoc?.folder.length || 0) / perPage);
});
// sort
type SortBy = "oldest" | "latest";
const sortBy = ref<SortBy>("latest");
const sortConf: Record<
  SortBy,
  {
    label: string;
    iconName: string;
  }
> = {
  oldest: { label: "Oldest", iconName: "mdi:arrow-down" },
  latest: { label: "Latest", iconName: "mdi:arrow-up" },
};
const preparedFolders = computed(() => {
  let sorted =
    sortBy.value === "latest"
      ? useAuth().userDoc?.folder.toSorted(
          (a, b) =>
            b.updatedAt.toDate().getTime() - a.updatedAt.toDate().getTime()
        )
      : useAuth().userDoc?.folder.toSorted(
          (a, b) =>
            a.updatedAt.toDate().getTime() - b.updatedAt.toDate().getTime()
        );
  return sorted?.slice(
    (currentPage.value - 1) * perPage,
    currentPage.value * perPage
  );
});
</script>

<style></style>
