export default function <S extends {}, R extends {} = S>(conf: {
  title: string;
  schema: any;
  initialValues: (record?: R) => Partial<S>;
  handlers: {
    create: (values: S) => Promise<void>;
    update: (record: R, values: S) => Promise<void>;
  };
}) {
  const modalActive = ref(false);
  const formActive = ref(false);
  const action = ref<"create" | "update" | null>(null);
  const contextRecord = ref<R | null>(null);
  const form = ref<ReturnType<typeof useForm<S>> | null>(null);
  function open(act: "create" | "update", record?: R) {
    action.value = act;
    contextRecord.value = (record || null) as any;
    form.value = useForm<S>({
      validationSchema: conf.schema,
      initialValues: conf.initialValues(record) as any,
    }) as any;
    afterRerender(formActive, () => {
      modalActive.value = true;
    });
  }
  async function handleSubmit() {
    if (!form.value) return;
    if (!(await form.value.validate()).valid) return;
    const { startLoading, stopLoading } = useAppLoading();
    startLoading();
    try {
      await form.value.handleSubmit(async (values) => {
        if (action.value === "create") {
          await conf.handlers.create(values);
        } else {
          await conf.handlers.update(contextRecord.value as any, values);
        }
        modalActive.value = false;
      })();
      useToast().toastSuccess(`Success ${action.value} ${conf.title}`);
    } catch (error: any) {
      useToast().toastError(error.message || error);
    } finally {
      stopLoading();
    }
  }

  return {
    title: conf.title,

    modalActive,
    formActive,
    action,
    contextRecord,
    form,
    open,
    handleSubmit,
  };
}
