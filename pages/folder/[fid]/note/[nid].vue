<template>
  <div class="flex flex-col md:flex-row gap-10">
    <AppContentSection v-if="shouldRender" class="flex-1">
      <template #header>
        <div class="flex flex-col gap-2">
          <section>
            <button
              class="hover:underline"
              @click="navigateTo(`/folder/${$route.params.fid}`)"
            >
              <Icon name="mdi:chevron-left" />
              <span>Back to Folder "{{ folder?.title }}"</span>
            </button>
          </section>
          <section class="flex justify-between text-sm">
            <section class="text-2xl">{{ note?.title }}</section>
            <section>
              <button class="app-button" @click="onSubmitContent">Save</button>
            </section>
          </section>
        </div>
      </template>

      <div class="flex flex-col gap-5">
        <div class="h-[70dvh] pb-8">
          <QuillEditor
            v-if="form !== null"
            content-type="html"
            v-model:content="form.defineField('content')[0].value"
          />
        </div>
      </div>
    </AppContentSection>
    <div for="aside" class="w-full md:w-[250px]">
      <div class="sticky top-4 flex flex-col gap-4">
        <AppContentSection title="Details">
          <AppMetaCard
            :meta="{
              title: note?.title || '',
              createdAt: $dayjs(note?.createdAt.toDate()).fromNow(),
              updatedAt: $dayjs(note?.updatedAt.toDate()).fromNow(),
              createdBy: note?.createdBy.name || '',
              updatedBy: note?.updatedBy.name || '',
            }"
          ></AppMetaCard>
        </AppContentSection>
        <AppContentSection title="Tags">
          <PageIndexTagList
            :tags="
              useAuth().userDoc?.tags.filter((t) =>
                note?.tagIds.includes(t.id)
              ) || []
            "
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
import { doc, runTransaction } from "firebase/firestore";
import {
  createUserDocRef,
  type NoteRecord,
  type UserDoc,
  type NoteChunk,
  type NoteRecordSchema,
  noteRecordModel,
} from "~/assets/models/user";

const folder = computed(() => {
  return useAuth().userDoc?.folder.find((f) => f.id === useRoute().params.fid);
});
const note = computed(() => {
  return folder.value?.notes.find((n) => n.id === useRoute().params.nid);
});
const hist = computed(() => {
  return useAuth().userDoc?.history.filter(
    (h) => h.target.id === useRoute().params.nid
  );
});
const shouldRender = computed(() => {
  return folder.value && note.value;
});

// form
const { db } = useNuxtApp().$fb;
const content = ref<string | null>(null);
const contentPending = ref(true);
const form = ref<ReturnType<typeof useForm<NoteRecordSchema>> | null>(null);
async function onSubmitContent() {
  if (!form.value?.validate() || !note.value) return;
  if (!confirm("Are you sure you want to save this note?")) return;
  const { startLoading, stopLoading } = useAppLoading();
  try {
    startLoading();
    await noteRecordModel.updateContent(
      note.value,
      form.value.values.content || ""
    );
    // await noteRecordModel.update(note.value, {
    //   title: note.value?.title,
    //   folderId: folder.value?.id || "",
    //   tagIds: form.value.values.tagIds,
    //   content: form.value.values.content,
    // });
  } catch (error) {
    console.log(error);
  } finally {
    stopLoading();
  }
}
onMounted(async () => {
  // aggregate content
  const userDocRef = createUserDocRef();
  const _content = await runTransaction<string>(db, async (tsc) => {
    const userDoc = (await tsc.get(userDocRef)).data() as UserDoc;
    const noteRecord = userDoc.folder
      .find((f) => f.id === useRoute().params.fid)
      ?.notes.find((n) => n.id === useRoute().params.nid) as NoteRecord;
    let resultContent = noteRecord.content.first;
    if (noteRecord.content.restChunk.length > 0) {
      const restChunks = [];
      for (const chunk of noteRecord.content.restChunk.sort(
        (a, b) => a.order - b.order
      )) {
        const chunkDoc = (
          await tsc.get(doc(db, chunk.docPath))
        ).data() as NoteChunk;
        restChunks.push(chunkDoc.content);
      }
      resultContent += restChunks.join("");
    }
    return resultContent;
  });
  content.value = _content;
  await new Promise((r) => setTimeout(r, 200));
  form.value = useForm<NoteRecordSchema>({
    initialValues: {
      title: note.value?.title,
      content: _content,
      folderId: folder.value?.id,
      tagIds: note.value?.tagIds,
    },
  }) as any;
  contentPending.value = false;
});
</script>

<style></style>
