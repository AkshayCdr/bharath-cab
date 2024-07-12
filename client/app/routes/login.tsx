import { ActionFunctionArgs, LinksFunction } from "@remix-run/node";
import { redirect, useActionData } from "@remix-run/react";
import { account } from "apis/account";
import LoginInput from "../component/LoginInput";
import styles from "../styles/login.css?url";

const isUsernameValid = (username) => username.length > 2;

const isPasswordValid = (password) => password.length > 2;

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const userDetails = Object.fromEntries(formData);

  const errors: { username?: string; password?: string } = {};

  const username = formData.get("username");
  const password = formData.get("password");

  if (!isUsernameValid(username)) errors.username = "Invalid username";
  if (!isPasswordValid(password)) errors.password = "Invalid Password";

  if (Object.keys(errors).length) {
    return {
      errors,
    };
  }

  const { id, accountType } = await account.login(userDetails);

  const isUser = accountType === "user";
  const isDriver = accountType === "driver";

  if (isUser) return redirect(`/user/${id}`);
  if (isDriver) return redirect(`/driver/${id}`);
}

export default function Login() {
  return (
    <div
      className="flex flex-col m-6 p-36  rounded-md bg-center bg-cover "
      style={{
        backgroundImage: `url('/home.jpg')`,
      }}
    >
      <LoginInput />
    </div>
  );
}

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];
