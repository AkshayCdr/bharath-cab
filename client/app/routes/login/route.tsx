import { ActionFunctionArgs, LinksFunction } from "@remix-run/node";
import { redirect } from "@remix-run/react";
import { account } from "~/apis/account";
import LoginInput from "../../component/LoginInput";
import styles from "../../styles/login.css?url";
import { validate } from "./validation";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const userDetails = Object.fromEntries(formData);

  const username = String(formData.get("username"));
  const password = String(formData.get("password"));

  const error: { username?: string; password?: string } = {};

  const errors = validate(error, username, password);

  if (errors) {
    return { errors };
  }

  const data = await account.login(userDetails);

  if (!data) {
    throw new Error("Invalid response from server");
  }

  const isUser = data.accountType === "user";
  const isDriver = data.accountType === "driver";

  if (isUser) return redirect(`/user/${data.id}`);
  if (isDriver) return redirect(`/driver/${data.id}`);
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
