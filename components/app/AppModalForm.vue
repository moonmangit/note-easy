<template>
  <form
    v-if="cont.form.value && cont.formActive.value"
    @submit.prevent="cont.handleSubmit"
  >
    <AppFormBody
      :title="
        cont.action.value === 'create'
          ? `Create ${cont.title}`
          : `Update ${cont.title}`
      "
    >
      <slot :="cont.form.value"></slot>
      <template #footer>
        <div class="flex justify-between">
          <button
            class="app-button"
            type="button"
            @click.prevent="cont.form.value.resetForm()"
          >
            Reset
          </button>
          <button class="app-button" type="submit">Submit</button>
        </div>
      </template>
    </AppFormBody>
  </form>
</template>

<script lang="ts" setup generic="S extends {}, R extends {}">
const props = defineProps<{
  cont: ReturnType<typeof useModalForm<S, R>>;
}>();
</script>

<style></style>
