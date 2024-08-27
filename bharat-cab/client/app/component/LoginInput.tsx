// import React from 'react'
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { action } from "~/routes/login";

export default function LoginInput() {
    const actionData = useActionData<typeof action>();

    const navigation = useNavigation();

    const isSubmitting = navigation.state !== "idle";

    const usernameError = actionData?.errors?.username;
    const passwordError = actionData?.errors?.password;
    const isCrendetialsInValid = actionData?.errors?.invalidCredentials;

    console.log(isCrendetialsInValid);

    return (
        <Form
            method="POST"
            id="login-form"
            className="flex flex-col  bg-gray-950 opacity-90 text-white items-center  rounded-lg w-fit m-auto h-fit p-8"
        >
            <p className="flex flex-col   sm:w-full sm:max-w-md ">
                <input
                    className="m-5 p-2  rounded-md border text-black"
                    type="text"
                    name="username"
                    placeholder="username"
                    required
                    minLength={2}
                    maxLength={30}
                />
                {usernameError && (
                    <span className="text-red-500">{usernameError}</span>
                )}
                <input
                    className="m-4 p-2 rounded-md border text-black"
                    type="password"
                    name="password"
                    placeholder="password"
                    required
                    minLength={2}
                    maxLength={30}
                />
                {passwordError && (
                    <span className="text-red-500">{passwordError}</span>
                )}
            </p>
            <p className="login-button m-4">
                <button
                    className="submit bg-blue-600 text-white py-2 px-5 rounded-md"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "submitting..." : "submit"}
                </button>
            </p>
            {isCrendetialsInValid && (
                <span className="text-red-600">Invalid credentials</span>
            )}
        </Form>
    );
}
