import * as yup from "yup";

const loginSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
});
type LoginSchema = yup.InferType<typeof loginSchema>;

const createLoginForm = () => {
  return useForm<LoginSchema>({
    validationSchema: loginSchema,
  });
};

export type { LoginSchema };
export { loginSchema, createLoginForm };
