interface SignupFormData {
  email: string | null;
  password: string | null;
  password2?: string | null;
}

interface LoginFormData {
  email: string | null;
  password: string | null;
}

export { SignupFormData, LoginFormData };
