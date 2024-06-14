import { ActionFunctionArgs } from "@remix-run/node";
import { Link, redirect, useActionData } from "@remix-run/react";
import { account } from "apis/account";
import LoginInput from "../component/LoginInput";
// interface userDetails{
//   username:string,
//   password:string
// }

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const userDetails = Object.fromEntries(formData);

  const driver = formData.get("driver") === "check";
  const user = formData.get("user") === "check";

  if (!userDetails.username || !userDetails.password)
    return { message: "invalid username or password" };

  const id = await account.login(userDetails);
  console.log(id);

  if (user) return redirect(`/user/${id}`);
  if (driver) return redirect(`/driver/${id}`);
  return redirect("/");
}

export default function Login() {
  const data = useActionData();
  return (
    <div>
      {data?.message && <p>{data.message}</p>}
      <Link to={`/user`}>user</Link>
      <Link to={`/driver`}>driver</Link>
      <LoginInput />
    </div>
  );
}
