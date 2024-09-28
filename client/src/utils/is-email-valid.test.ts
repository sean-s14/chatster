import isEmailValid from "@/utils/is-email-valid";

const emailExamples: { email: string; isValid: boolean }[] = [
  {
    email: "test@example.com",
    isValid: true,
  },
  {
    email: "test@example",
    isValid: false,
  },
  {
    email: "test@example.",
    isValid: false,
  },
  {
    email: "testexample.com",
    isValid: false,
  },
  {
    email: "@example.com",
    isValid: false,
  },
];

describe("isEmailValid", () => {
  it.each(emailExamples)(
    "should return $isValid for $email",
    ({ email, isValid }) => {
      expect(isEmailValid(email)).toBe(isValid);
    }
  );
});
