export type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  phone: string;
  date_of_birth?: string;
  role: "client" | "owner";
};

export type LoginFormValues = {
  email: string;
  password: string;
};
