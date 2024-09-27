import isEmailValid from "@/utils/isEmailValid";

export interface ValidateEmailReturn {
  valid: boolean;
  errors: { email: string };
}

const validateEmail = (
  email: string | null,
  checkNull: boolean = false
): ValidateEmailReturn => {
  const defaultReturn = { valid: true, errors: { email: "" } };
  if (!checkNull && email === null) {
    return defaultReturn;
  }

  if (!email) {
    return { valid: false, errors: { email: "Email is required" } };
  }

  if (!isEmailValid(email)) {
    return { valid: false, errors: { email: "Email is invalid" } };
  }

  return defaultReturn;
};

export interface ValidatePasswordReturn {
  valid: boolean;
  errors: { password: string };
}

const validatePassword = (
  password: string | null,
  checkNull: boolean = false
): ValidatePasswordReturn => {
  const defaultReturn = { valid: true, errors: { password: "" } };

  if (!checkNull && password === null) {
    return defaultReturn;
  }

  if (!password) {
    return { valid: false, errors: { password: "Password is required" } };
  }

  return defaultReturn;
};

export interface ValidatePasswordsReturn {
  valid: boolean;
  errors: { password2: string };
}

const validateConfirmPassword = (
  password: string | null,
  confirmPassword: string | null,
  checkNull: boolean = false
): ValidatePasswordsReturn => {
  const defaultReturn = {
    valid: true,
    errors: { password2: "" },
  };

  if (!checkNull && confirmPassword === null) {
    return defaultReturn;
  }

  if (password !== confirmPassword) {
    return {
      valid: false,
      errors: { password2: "Passwords do not match" },
    };
  }

  return defaultReturn;
};

export { validateEmail, validatePassword, validateConfirmPassword };
