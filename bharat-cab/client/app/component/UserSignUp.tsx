import { Form, useActionData } from "@remix-run/react";
import { Error } from "~/utils/validation.server";

export default function UserSignUp() {
    const err: Error = useActionData();

    return (
        <Form
            method="POST"
            className="max-w-md mx-auto flex flex-col bg-gray-950 gap-8 m-5 p-10 rounded-lg opacity-70 text-white"
        >
            <input
                type="text"
                name="name"
                id=""
                required
                className="h-10 bg-gray-950 border-b-2  focus:outline-none text-2xl focus:border-b-4  focus:border-yellow-300 hover:border-b-4"
                placeholder="Name"
            />
            {err?.nameError && (
                <div className="text-red-600">{err.nameError} </div>
            )}

            <input
                type="email"
                name="email"
                id=""
                className="h-10  bg-gray-950 border-b-2  focus:outline-none text-2xl focus:border-b-4  focus:border-yellow-300 hover:border-b-4"
                placeholder="Email"
            />

            {err?.emailError && (
                <div className="text-red-600">{err.emailError}</div>
            )}

            <input
                type="number"
                name="phone"
                minLength={10}
                maxLength={10}
                id=""
                required
                className="h-10 bg-gray-950 border-b-2  focus:outline-none text-2xl focus:border-b-4  focus:border-yellow-300 hover:border-b-4"
                placeholder="Phone"
            />
            {err?.phoneError && (
                <div className="text-red-600 ">{err.phoneError}</div>
            )}

            <input
                type="text"
                name="username"
                minLength={3}
                id=""
                required
                className="h-10  bg-gray-950 border-b-2  focus:outline-none text-2xl focus:border-b-4  focus:border-yellow-300 hover:border-b-4"
                placeholder="Username"
            />

            {err?.usernameError && (
                <div className="text-red-600">{err.usernameError}</div>
            )}

            <input
                type="password"
                name="password"
                minLength={3}
                required
                className="h-10  bg-gray-950 border-b-2  focus:outline-none text-2xl focus:border-b-4  focus:border-yellow-300 hover:border-b-4"
                placeholder="Password"
            />

            {err?.passwordError && (
                <div className="text-red-600">{err.passwordError}</div>
            )}

            <button
                className="submit bg-blue-600 text-white py-2 px-5 rounded-md w-40 m-auto hover:bg-blue-800"
                name="intent"
                value="createUser"
            >
                submit
            </button>
        </Form>
    );
}
