import {
    ActionFunctionArgs,
    LinksFunction,
    LoaderFunctionArgs,
} from "@remix-run/node";
import { redirect } from "@remix-run/react";
import { account } from "~/apis/account.server";
import LoginInput from "../../component/LoginInput";
import styles from "~/styles/login.css?url";
import { validate } from "./validation.server";

import { authLoader } from "~/utils/auth.server";

export const loader = authLoader;

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();

    const userDetails = Object.fromEntries(formData);

    const username = String(formData.get("username"));
    const password = String(formData.get("password"));

    const error: {
        username?: string;
        password?: string;
        invalidCredentials?: boolean;
    } = {};

    const errors = validate(error, username, password);

    if (Object.keys(errors).length) {
        return { errors };
    }

    const response = await account.login(userDetails);

    if (!response) {
        error.invalidCredentials = true;

        return { errors };
    }

    const cookieHeader = response.headers.get("set-cookie");

    const data = await account.getAccountType(cookieHeader);
    if (!data) return null;

    const isUser = data.accountType === "user";
    const isDriver = data.accountType === "driver";

    if (isUser)
        return redirect(`/user`, {
            headers: {
                "Set-Cookie": cookieHeader,
            },
        });
    if (isDriver)
        return redirect(`/driver`, {
            headers: {
                "Set-Cookie": cookieHeader,
            },
        });
    return redirect("/login");
}

export default function Login() {
    return (
        <div
            className="flex flex-col m-6  rounded-md bg-center bg-cover"
            style={{
                backgroundImage: `url('/home.jpg')`,
                height: "500px",
            }}
        >
            <LoginInput />
        </div>
    );
}

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];
