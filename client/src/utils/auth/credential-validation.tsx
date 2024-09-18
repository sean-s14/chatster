import { LoginFormData, SignupFormData } from "@/types/form-data";

interface LoginValidateReturn {
  valid: boolean;
  errors: LoginFormData;
}

interface SignupValidateReturn {
  valid: boolean;
  errors: SignupFormData;
}

const loginValidate = (
  formData: LoginFormData,
  checkNull?: boolean
): LoginValidateReturn => {
  let valid = true;
  let errors: LoginFormData = { email: "", password: "" };

  // Email validation
  if (!checkNull && formData.email === null) {
  } else if (!formData.email) {
    errors.email = "Email is required";
    valid = false;
    return { valid, errors };
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = "Email is invalid";
    valid = false;
    return { valid, errors };
  }

  // Password validation
  if (!checkNull && formData.password === null) {
  } else if (!formData.password) {
    errors.password = "Password is required";
    valid = false;
    return { valid, errors };
  } else if (formData.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
    valid = false;
    return { valid, errors };
  }

  return { valid, errors };
};

const signupValidate = (
  formData: SignupFormData,
  checkNull?: boolean
): SignupValidateReturn => {
  let valid = true;
  let errors: SignupFormData = { email: "", password: "", password2: "" };

  // Email validation
  if (!checkNull && formData.email === null) {
  } else if (!formData.email) {
    errors.email = "Email is required";
    valid = false;
    return { valid, errors };
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = "Email is invalid";
    valid = false;
    return { valid, errors };
  }

  // Password validation
  if (!checkNull && formData.password === null) {
  } else if (!formData.password) {
    errors.password = "Password is required";
    valid = false;
    return { valid, errors };
  } else if (formData.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
    valid = false;
    return { valid, errors };
  }

  // Password confirmation
  if (!checkNull && formData.password2 === null) {
  } else if (formData.password !== formData.password2) {
    errors.password2 = "Passwords do not match";
    valid = false;
    return { valid, errors };
  }

  return { valid, errors };
};

export { loginValidate, signupValidate };
