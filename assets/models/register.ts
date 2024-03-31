import * as yup from "yup";

const registerSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match"),
});
type RegisterSchema = yup.InferType<typeof registerSchema>;

const createRegisterForm = () => {
  return useForm<RegisterSchema>({
    validationSchema: registerSchema,
  });
};

export type { RegisterSchema };
export { registerSchema, createRegisterForm };
