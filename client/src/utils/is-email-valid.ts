function isEmailValid(email: string) {
  const emailRegex = /\S+@\S+\.\S+/;
  return emailRegex.test(email);
}

export default isEmailValid;
