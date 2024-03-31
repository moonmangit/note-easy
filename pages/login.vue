<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <AppFormBody title="Welcome !">
        <template #default>
          <AppInputGroup label="Email" :message="loginForm.errors.value.email">
            <input
              class="app-input"
              type="email"
              v-model="loginForm.defineField('email')[0].value"
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
  layout: false,
});

// Login controller
const loginForm = createLoginForm();
const handleSubmit = loginForm.handleSubmit(async (values, context) => {
  try {
    const { auth } = useNuxtApp().$fb;
    await signInWithEmailAndPassword(auth, values.email, values.password);
    nextTick(() => {
      navigateTo("/");
    });
  } catch (error: any) {
    console.error(error.message);
  }
});
</script>
