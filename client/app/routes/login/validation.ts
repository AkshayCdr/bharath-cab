const isUsernameValid = (username) => username.length > 2;

const isPasswordValid = (password) => password.length > 2;

export function validate(errors, username: string, password: string) {
  if (!isUsernameValid(username)) errors.username = "Invalid username";
  if (!isPasswordValid(password)) errors.password = "Invalid Password";

  if (Object.keys(errors).length) {
    return errors;
  }
  return null;
}
