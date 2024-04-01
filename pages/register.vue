<template>
  <div class="w-screen h-screen flex items-center justify-center bg-slate-400">
    <form
      @submit.prevent="handleSubmit"
      class="w-[min(350px,90dvw)] bg-white p-4"
    >
      <AppFormBody
        title="Register to Notez app"
        description="please fill the form to register a new account."
      >
        <template #default>
          <AppInputGroup
            label="Email"
            :message="registerForm.errors.value.email"
          >
            <input
              class="app-input"
              type="email"
              v-model="registerForm.defineField('email')[0].value"
            />
          </AppInputGroup>
          <AppInputGroup
            label="Password"
            :message="registerForm.errors.value.password"
          >
            <input
              class="app-input"
              type="password"
              v-model="registerForm.defineField('password')[0].value"
            />
          </AppInputGroup>
          <AppInputGroup
            label="Confirm Password"
            :message="registerForm.errors.value.confirmPassword"
          >
            <input
              class="app-input"
              type="password"
              v-model="registerForm.defineField('confirmPassword')[0].value"
            />
          </AppInputGroup>
        </template>
        <template #footer>
          <div class="flex justify-between items-center">
            <button type="button" @click.prevent="navigateTo('/login')">
              <Icon name="mdi:chevron-left"></Icon>
              <span class="underline"> back to login </span>
            </button>
            <button type="submit" class="app-button">Register</button>
          </div>
        </template>
      </AppFormBody>
    </form>
  </div>
</template>

<script lang="ts" setup>
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { createRegisterForm } from "~/assets/models/register";

definePageMeta({
  layout: false,
});

// Register controller
const registerForm = createRegisterForm();
const handleSubmit = registerForm.handleSubmit(async (values, context) => {
  const { startLoading, stopLoading } = useAppLoading();
  try {
    startLoading();
    const { auth } = useNuxtApp().$fb;
    await createUserWithEmailAndPassword(auth, values.email, values.password);
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
