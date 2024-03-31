<template>
  <div>
    <ul
      for="note list"
      class="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4"
    >
      <li for="add" class="flex items-center justify-center gap-1">
        <Icon name="mdi:book-plus" />
        <span>new Note</span>
      </li>
      <li
        v-for="i in 10"
        :key="i"
        @click="navigateTo(`/folder/${$route.params.fid}/note/${i}`)"
      >
        <div class="p-2 text-sm flex flex-col gap-1">
          <header class="flex flex-col gap-1">
            <section class="flex justify-between">
              <h3 class="font-medium">Note {{ i }}</h3>
              <p class="text-slate-400">{{ $dayjs(Date.now()).fromNow() }}</p>
            </section>
            <PageIndexTagList
              :tags="[
                {
                  id: '1',
                  name: 'tag1',
                },
                {
                  id: '2',
                  name: 'tag2',
                },
                {
                  id: '3',
                  name: 'tag3',
                },
              ]"
              :active-ids="['1']"
            />
          </header>
          <main class="whitespace-normal line-clamp-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum non,
            mollitia nemo ducimus voluptatibus et nam a corrupti vel suscipit
            delectus minus quo. Minus sequi nam unde neque quis officiis
            accusantium dolor deserunt eaque, veritatis iste quo dolorem? Vitae,
            assumenda sed cum unde earum dignissimos numquam sapiente libero
            eligendi architecto nobis ratione nam nisi tempore dolores quidem
            quo praesentium et quas a pariatur aut distinctio explicabo
            excepturi? Fugit sapiente maxime eius similique, minima sequi
            explicabo sint, dolor quaerat, quia tempora unde recusandae magni
            cum. Qui deserunt quis molestias. Aspernatur, expedita quae
            consequuntur recusandae dolorum at reprehenderit perferendis
            suscipit reiciendis vero?
          </main>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped>
ul[for="note list"] {
  > li {
    @apply h-[200px] bg-slate-200 border border-transparent;
    @apply hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-300 duration-300;
    @apply hover:border-slate-400 cursor-pointer;
  }
  > li[for="add"] {
  }
}
</style>
