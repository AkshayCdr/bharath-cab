import { ActionFunctionArgs, LinksFunction } from "@remix-run/node";
import { redirect, useActionData } from "@remix-run/react";
import { account } from "apis/account";
import LoginInput from "../component/LoginInput";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const userDetails = Object.fromEntries(formData);

  const driver = formData.get("driver") === "check";
  const user = formData.get("user") === "check";

  if (!userDetails.username || !userDetails.password)
    return { message: "invalid username or password" };

  const id = await account.login(userDetails);

  if (user) return redirect(`/user/${id}`);
  if (driver) return redirect(`/driver/${id}`);
  return { message: "select user/driver" };
}

export default function Login() {
  const data = useActionData();
  return (
    <div>
      {data?.message && <p className="login-alert">{data.message}</p>}
      <LoginInput />
    </div>
  );
}
