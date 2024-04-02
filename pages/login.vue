<template>
  <div class="w-screen h-screen flex items-center justify-center">
    <form
      @submit.prevent="handleSubmit"
      class="w-[min(350px,90dvw)] bg-white p-4"
    >
      <AppFormBody
        title="Welcome to Notez app"
        description="please login with registered email and password."
      >
        <template #default>
          <AppInputGroup label="Email" :message="loginForm.errors.value.email">
            <input
              class="app-input"
              type="email"
              v-model="loginForm.defineField('email')[0].value"
              name="email"
              autocomplete="email"
              placeholder="example@mail.com"
            />
          </AppInputGroup>
          <AppInputGroup
            label="Password"
            :message="loginForm.errors.value.password"
          >
            <input
              class="app-input"
              type="password"
              v-model="loginForm.defineField('password')[0].value"
              name="password"
              placeholder="●●●●●●●●"
            />
          </AppInputGroup>
        </template>
        <template #footer>
          <div class="flex justify-between items-center">
            <button
              type="button"
              class="underline"
              @click.prevent="navigateTo('/register')"
            >
              don't have an account ?
            </button>
            <button type="submit" class="app-button">Login</button>
          </div>
        </template>
      </AppFormBody>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { signInWithEmailAndPassword } from "firebase/auth";
import { createLoginForm } from "~/assets/models/login";

definePageMeta({
  layout: "single-form",
});

// Login controller
const loginForm = createLoginForm();
const handleSubmit = loginForm.handleSubmit(async (values, context) => {
  const { startLoading, stopLoading } = useAppLoading();
  try {
    startLoading();
    const { auth } = useNuxtApp().$fb;
    await signInWithEmailAndPassword(auth, values.email, values.password);
    nextTick(() => {
      navigateTo("/");
    });
  } catch (error: any) {
    useToast().toastError(error.message);
  } finally {
    stopLoading();
  }
});
</script>
