<template>
  <div class="flex flex-col md:flex-row gap-10">
    <AppContentSection class="flex-1">
      <template #header>
        <div class="flex flex-col gap-2 border-b-[1px] border-slate-200 pb-2">
          <section>
            <button class="hover:underline text-sm" @click="navigateTo('/')">
              <Icon name="mdi:chevron-left" />
              <span>Back to My folders</span>
            </button>
          </section>
          <section class="flex justify-between text-sm">
            <section>
              <span class="text-slate-700 font-medium">Your Profile</span>
            </section>
          </section>
        </div>
      </template>
      <form @submit.prevent="handleUpdate">
        <div class="flex gap-8 flex-col container max-w-xl mx-auto">
          <section class="flex flex-col gap-4 items-center justify-center">
            <div class="relative">
              <div class="w-[150px] aspect-square rounded-full overflow-hidden">
                <img
                  :src="form.values.photoURL || useAuth().getUserImageUrl"
                  class="w-full h-full object-cover"
                />
              </div>
              <button
                @click.prevent="openFileDialog()"
                class="absolute bottom-0 right-3 bg-slate-300 flex items-center gap-1 text-xs w-7 aspect-square justify-center rounded-full"
              >
                <Icon name="mdi:camera" />
              </button>
            </div>
            <h1 class="text-2xl">{{ useAuth().profile?.displayName }}</h1>
          </section>
          <section class="flex-1 flex flex-col gap-3">
            <AppInputGroup label="UID (readonly)">
              <input
                type="text"
                class="app-input"
                v-model="form.defineField('uid')[0].value"
                readonly
              />
            </AppInputGroup>
            <AppInputGroup label="Email (readonly)">
              <input
                type="text"
                class="app-input"
                placeholder="example@mail.com"
                v-model="form.defineField('email')[0].value"
                readonly
              />
            </AppInputGroup>
            <AppInputGroup
              label="Display Name"
              :message="form.errors.value.displayName"
            >
              <input
                type="text"
                class="app-input"
                placeholder="John Doe"
                v-model="form.defineField('displayName')[0].value"
              />
            </AppInputGroup>
            <button
              class="app-button--outline w-fit"
              @click.prevent="
                form.setFieldValue(
                  'isChangePassword',
                  !form.values.isChangePassword
                )
              "
            >
              Change Password
            </button>
            <template v-if="form.values.isChangePassword">
              <AppInputGroup
                label="New Password"
                :message="form.errors.value.newPassword"
              >
                <input
                  type="password"
                  class="app-input"
                  placeholder="●●●●●●●●"
                  v-model="form.defineField('newPassword')[0].value"
                  :disabled="!form.defineField('isChangePassword')[0].value"
                />
              </AppInputGroup>
              <AppInputGroup
                label="Confirm New Password"
                :message="form.errors.value.confirmNewPassword"
              >
                <input
                  type="password"
                  class="app-input"
                  placeholder="●●●●●●●●"
                  v-model="form.defineField('confirmNewPassword')[0].value"
                  :disabled="!form.defineField('isChangePassword')[0].value"
                />
              </AppInputGroup>
            </template>
          </section>
        </div>
        <hr class="my-4" />
        <footer class="flex justify-between">
          <section class="flex gap-x-2">
            <button
              class="app-button--outline"
              type="button"
              @click.prevent="handleDelete"
            >
              Delete
            </button>
            <button
              class="app-button--outline"
              type="button"
              @click.prevent="form.resetForm()"
            >
              Reset
            </button>
          </section>
          <button class="app-button" type="submit">Submit</button>
        </footer>
      </form>
    </AppContentSection>
  </div>
</template>

<script lang="ts" setup>
import { signOut, type User } from "firebase/auth";
import * as yup from "yup";
import getRequestEndpoint from "~/utils/api";

// Update controller
const profileSchema = yup.object({
  uid: yup.string().required(),
  email: yup.string().email().required(),
  displayName: yup
    .string()
    .trim()
    .matches(/^[a-zA-Z ]+$/, "Only letters and spaces are allowed"),
  photoURL: yup.string(), // blob url
  // reset password
  isChangePassword: yup.boolean(),
  newPassword: yup
    .string()
    .trim()
    .when("isChangePassword", {
      is: true,
      then: (schema) => schema.required(),
    }),
  confirmNewPassword: yup
    .string()
    .trim()
    .when("isChangePassword", {
      is: true,
      then: (schema) =>
        schema
          .required()
          .oneOf([yup.ref("newPassword")], "Passwords must match"),
    }),
});
const form = useForm<yup.InferType<typeof profileSchema>>({
  initialValues: {
    uid: useAuth().profile?.uid || "",
    email: useAuth().profile?.email || "",
    displayName: useAuth().profile?.displayName || undefined,
    photoURL: useAuth().profile?.photoURL || "",
    isChangePassword: false,
    newPassword: "",
    confirmNewPassword: "",
  },
  validationSchema: profileSchema,
});
const handleUpdate = form.handleSubmit(async (values) => {
  if (!confirm("Are you sure you want to update your profile?")) return;
  const { startLoading, stopLoading } = useAppLoading();
  try {
    startLoading();
    const formData = new FormData();
    let base64Image = "";
    if (values.photoURL) {
      base64Image = await blobToBase64(
        await (await fetch(values.photoURL)).blob()
      );
      formData.append("photoURL", base64Image);
    }
    let body = {
      displayName: values.displayName,
      password: values.newPassword,
      photoBase64: base64Image,
    };
    const res: {
      data: {
        user: User;
      };
    } = await $fetch(getRequestEndpoint("/profile/:uid"), {
      method: "PATCH",
      headers: await getRequestHeaders(),
      body,
    });
    useToast().toastSuccess("Profile updated successfully");
    await signOut(useNuxtApp().$fb.auth);
    nextTick(() => {
      navigateTo("/login");
    });
  } catch (error) {
    useToast().toastError("Failed to update profile");
    console.error(error);
  } finally {
    stopLoading();
  }
});
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      resolve(reader.result?.toString() || "");
    };
    reader.onerror = reject;
  });
}

// Delete Controller
async function handleDelete() {
  if (!confirm("Are you sure you want to delete your account?")) return;
  const { startLoading, stopLoading } = useAppLoading();
  try {
    startLoading();
    await $fetch(getRequestEndpoint("/profile/:uid"), {
      method: "DELETE",
      headers: await getRequestHeaders(),
    });
    useToast().toastSuccess("Account deleted successfully");
    await useAuth().logout();
  } catch (error) {
    useToast().toastError(`Failed to delete account, ${error}`);
  } finally {
    stopLoading();
  }
}

// File controller
const { open: openFileDialog, onChange } = useFileDialog({
  accept: "image/*",
  multiple: false,
});
onChange((files) => {
  const limitMB = 5;
  if (!files?.length) return;
  const file = files[0];
  if (file.size > limitMB * 1024 * 1024) {
    useToast().toastError(`File size must be less than ${limitMB} MB`);
    return;
  }
  form.setFieldValue("photoURL", URL.createObjectURL(file));
});
</script>

<style></style>
