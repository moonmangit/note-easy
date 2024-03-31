<template>
  <div>
    <ul
      for="folder list"
      class="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4"
    >
      <li for="add" class="flex items-center justify-center gap-1">
        <Icon name="mdi:folder-plus" />
        <span>new Folder</span>
      </li>
      <li v-for="i in 10" :key="i" @click="navigateTo(`/folder/${i}`)">
        <div class="p-2 text-sm flex flex-col gap-1 h-full">
          <header class="flex flex-col gap-1">
            <section class="flex justify-between items-center">
              <h3 class="font-medium">Folder {{ i }}</h3>
              <section class="text-slate-400 flex gap-2">
                <button class="text-xl hover:text-slate-500 duration-300">
                  <Icon name="mdi:delete"></Icon>
                </button>
                <button class="text-xl hover:text-slate-500 duration-300">
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
                >1</span
              >
            </div>
          </main>
          <footer>
            <p class="text-slate-400">{{ $dayjs(Date.now()).fromNow() }}</p>
          </footer>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped>
ul[for="folder list"] {
  > li {
    @apply h-[200px] bg-slate-200 border border-transparent;
    @apply hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-300 duration-300;
    @apply hover:border-slate-400 cursor-pointer;
  }
  > li[for="add"] {
  }
}
</style>
