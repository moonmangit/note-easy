import type { Toast } from "~/components/app/AppToastList.vue";

export default defineStore("toast", () => {
  const arr = ref<Toast[]>([]);

  function remove(id: string) {
    arr.value = arr.value.filter((toast) => toast.id !== id);
  }
  function add(toast: Omit<Toast, "id">) {
    let id = randomString(10);
    arr.value.push({
      ...toast,
      id,
    });
    setTimeout(() => {
      remove(id);
    }, 5000);
  }
  function toastError(message: string) {
    add({
      type: "error",
      title: "Something went wrong",
      message,
    });
  }
  function toastSuccess(message: string) {
    add({
      type: "success",
      title: "Success",
      message,
    });
  }

  return {
    arr,
    toastError,
    toastSuccess,
    $reset() {
      arr.value = [];
    },
  };
});
