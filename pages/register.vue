<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <AppFormBody title="Register !">
        <template #default>
          <AppInputGroup
            label="Email"
            :message="RegisterForm.errors.value.email"
          >
            <input
              class="app-input"
              type="email"
              v-model="RegisterForm.defineField('email')[0].value"
            />
          </AppInputGroup>
          <AppInputGroup
            label="Password"
            :message="RegisterForm.errors.value.password"
          >
            <input
              class="app-input"
              type="password"
              v-model="RegisterForm.defineField('password')[0].value"
            />
          </AppInputGroup>
          <AppInputGroup
            label="Confirm Password"
            :message="RegisterForm.errors.value.confirmPassword"
          >
            <input
              class="app-input"
              type="password"
              v-model="RegisterForm.defineField('confirmPassword')[0].value"
            />
          </AppInputGroup>
        </template>
        <template #footer>
          <div class="flex justify-between items-center">
            <button
              type="button"
              class="underline"
              @click.prevent="navigateTo('/login')"
            >
              < back to login
            </button>
            <button type="submit" class="app-button">Register</button>
          </div>
        </template>
      </AppFormBody>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { createRegisterForm } from "~/assets/models/register";

definePageMeta({
  layout: false,
});

// Register controller
const RegisterForm = createRegisterForm();
const handleSubmit = RegisterForm.handleSubmit(async (values, context) => {
  try {
    const { auth } = useNuxtApp().$fb;
    console.log(auth, context);
  } catch (error: any) {
    console.error(error.message);
  }
});
</script>
