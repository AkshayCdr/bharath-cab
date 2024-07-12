import { ActionFunctionArgs, LinksFunction } from "@remix-run/node";
import { redirect, useActionData } from "@remix-run/react";
import { account } from "apis/account";
import LoginInput from "../component/LoginInput";
import styles from "../styles/login.css?url";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const userDetails = Object.fromEntries(formData);

  // const driver = formData.get("driver") === "check";
  // const user = formData.get("user") === "check";

  const { id, accountType } = await account.login(userDetails);

  console.log(id);
  console.log(accountType);
  // if (user) return redirect(`/user/${id}`);
  // if (driver) return redirect(`/driver/${id}`);
  return { message: "select user/driver" };
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
