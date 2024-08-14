import { Form } from "@remix-run/react";
import { useState } from "react";
import DriverSignUp from "~/component/DriverSignUp";
import UserSignUp from "~/component/UserSignUp";

export default function signUp() {
    const [role, setRole] = useState("user");

    return (
        <div>
            <div>
                <select
                    name="role"
                    id=""
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option value="user">User</option>
                    <option value="driver">Driver</option>
                </select>
            </div>
            {role === "user" && <UserSignUp />}
            {role === "driver" && <DriverSignUp />}
        </div>
    );
}
