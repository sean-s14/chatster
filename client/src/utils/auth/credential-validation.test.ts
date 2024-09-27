import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "@/utils/auth/credential-validation";

describe("Email Validation", () => {
  it("should return valid with no error for valid email", () => {
    const email = "test@example.com";
    const returnValue = validateEmail(email);
    expect(returnValue.valid).toBe(true);
    expect(returnValue.errors).toEqual({ email: "" });
  });

  it("should return invalid with error for invalid email", () => {
    const email = "invalid-email";
    const returnValue = validateEmail(email);
    expect(returnValue.valid).toBe(false);
    expect(returnValue.errors).toEqual({ email: "Email is invalid" });
  });

  it("should return invalid with error for empty email", () => {
    const email = "";
    const returnValue = validateEmail(email);
    expect(returnValue.valid).toBe(false);
    expect(returnValue.errors).toEqual({ email: "Email is required" });
  });

  it("should return valid with no error for null email", () => {
    const email = null;
    const returnValue = validateEmail(email);
    expect(returnValue.valid).toBe(true);
    expect(returnValue.errors).toEqual({ email: "" });
  });

  it("should return invalid with error for null email with checkNull set to true", () => {
    const email = null;
    const returnValue = validateEmail(email, true);
    expect(returnValue.valid).toBe(false);
    expect(returnValue.errors).toEqual({ email: "Email is required" });
  });
});

describe("Password Validation", () => {
  it("should return valid with no error for valid password", () => {
    const password = "password123";
    const returnValue = validatePassword(password);
    expect(returnValue.valid).toBe(true);
    expect(returnValue.errors).toEqual({ password: "" });
  });

  it("should return invalid with error for empty password", () => {
    const password = "";
    const returnValue = validatePassword(password);
    expect(returnValue.valid).toBe(false);
    expect(returnValue.errors).toEqual({ password: "Password is required" });
  });

  it("should return valid with error for null password", () => {
    const password = null;
    const returnValue = validatePassword(password);
    expect(returnValue.valid).toBe(true);
    expect(returnValue.errors).toEqual({ password: "" });
  });

  it("should return invalid with error for null password with checkNull set to true", () => {
    const password = null;
    const returnValue = validatePassword(password, true);
    expect(returnValue.valid).toBe(false);
    expect(returnValue.errors).toEqual({ password: "Password is required" });
  });
});

describe("Password Confirmation Validation", () => {
  it("should return valid with no error for matching passwords", () => {
    const password = "password123";
    const password2 = "password123";
    const returnValue = validateConfirmPassword(password, password2);
    expect(returnValue.valid).toBe(true);
    expect(returnValue.errors).toEqual({ password2: "" });
  });

  it("should return invalid with error for non-matching passwords", () => {
    const password = "password123";
    const password2 = "differentpassword";
    const returnValue = validateConfirmPassword(password, password2);
    expect(returnValue.valid).toBe(false);
    expect(returnValue.errors).toEqual({ password2: "Passwords do not match" });
  });

  it("should return invalid with error for empty password", () => {
    const password = "";
    const password2 = "password123";
    const returnValue = validateConfirmPassword(password, password2);
    expect(returnValue.valid).toBe(false);
    expect(returnValue.errors).toEqual({ password2: "Passwords do not match" });
  });

  it("should return invalid with error for empty password2", () => {
    const password = "password123";
    const password2 = "";
    const returnValue = validateConfirmPassword(password, password2);
    expect(returnValue.valid).toBe(false);
    expect(returnValue.errors).toEqual({ password2: "Passwords do not match" });
  });

  it("should return invalid with error for null password", () => {
    const password = null;
    const password2 = "password123";
    const returnValue = validateConfirmPassword(password, password2);
    expect(returnValue.valid).toBe(false);
    expect(returnValue.errors).toEqual({ password2: "Passwords do not match" });
  });

  it("should return valid with no error for null password2", () => {
    const password = "password123";
    const password2 = null;
    const returnValue = validateConfirmPassword(password, password2);
    expect(returnValue.valid).toBe(true);
    expect(returnValue.errors).toEqual({ password2: "" });
  });

  it("should return invalid with error for null password2 with checkNull set to true", () => {
    const password = "password123";
    const password2 = null;
    const returnValue = validateConfirmPassword(password, password2, true);
    expect(returnValue.valid).toBe(false);
    expect(returnValue.errors).toEqual({ password2: "Passwords do not match" });
  });

  it("should return valid with no error for null password and password2", () => {
    const password = null;
    const password2 = null;
    const returnValue = validateConfirmPassword(password, password2);
    expect(returnValue.valid).toBe(true);
    expect(returnValue.errors).toEqual({ password2: "" });
  });

  it("should return valid with no error for null password and password2 with checkNull set to true", () => {
    const password = null;
    const password2 = null;
    const returnValue = validateConfirmPassword(password, password2, true);
    expect(returnValue.valid).toBe(true);
    expect(returnValue.errors).toEqual({ password2: "" });
  });
});
