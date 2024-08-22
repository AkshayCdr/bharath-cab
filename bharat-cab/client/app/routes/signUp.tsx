import { ActionFunctionArgs, redirect } from "@remix-run/node";

import { useState } from "react";
import { driver } from "~/apis/driver.server";
import { user } from "~/apis/user.server";
import DriverSignUp from "~/component/DriverSignUp";
import UserSignUp from "~/component/UserSignUp";
import { isValidDriver, isValidUser } from "~/utils/validation.server";

interface Account {
    name: string;
    email: string;
    phone: number;
    username: string;
    password: string;
}
interface User extends Account {}

interface Driver extends Account {
    cabType: string;
    regNo: number;
}

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();

    const intent = formData.get("intent");

    const isDriver = intent === "createDriver";
    const isUser = intent === "createUser";

    const data = Object.fromEntries(formData);

    if (isDriver) {
        const err = isValidDriver(data);

        if (Object.keys(err).length > 0) {
            return err;
        }

        const response = await driver.create(data);

        if (!response) throw new Error("error setting data");
        return redirect("/login");
    }

    if (isUser) {
        const err = isValidUser(data);

        if (Object.keys(err).length > 0) {
            return err;
        }

        const response = await user.create(data);

        if (!response) throw new Error("error setting data");
        return redirect("/login");
    }
};

export default function SignUp() {
    const [role, setRole] = useState("user");

    return (
        <div className="bg-gray-950 h-screen">
            <div className="flex flex-col max-w-96 mx-auto border-2 rounded-lg">
                <div className="mx-auto mt-10 ">
                    <select
                        name="role"
                        id=""
                        onChange={(e) => setRole(e.target.value)}
                        className="h-10 w-52 text-white bg-gray-950 border-4 rounded-md p-2"
                    >
                        <option value="user">User</option>
                        <option value="driver">Driver</option>
                    </select>
                </div>
                <div>
                    {role === "user" && <UserSignUp />}
                    {role === "driver" && <DriverSignUp />}
                </div>
            </div>
        </div>
    );
}
