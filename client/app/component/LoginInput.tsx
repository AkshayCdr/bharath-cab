// import React from 'react'
import { Form, useActionData } from "@remix-run/react";
import { action } from "~/routes/login";

export default function LoginInput() {
  const actionData = useActionData<typeof action>();

  const usernameError = actionData?.errors?.username;
  const passwordError = actionData?.errors?.password;
  return (
    <Form
      method="POST"
      id="login-form"
      className="flex flex-col min-h-full flex-1 border p-8 m-5 bg-black opacity-90 text-white items-center justify-center rounded-lg mx-auto "
    >
      <p className="flex flex-col   sm:w-full sm:max-w-md ">
        <input
          className="m-5 p-2 rounded-md border text-black"
          type="text"
          name="username"
          placeholder="username"
          required
          minLength={2}
          maxLength={30}
        />
        {usernameError && <span className="text-red-500">{usernameError}</span>}
        <input
          className="m-4 p-2 rounded-md border text-black"
          type="password"
          name="password"
          placeholder="password"
          required
          minLength={2}
          maxLength={30}
        />
        {passwordError && <span className="text-red-500">{passwordError}</span>}
      </p>
      <p className="login-button m-4">
        <button className="submit bg-blue-600 text-white py-2 px-5 rounded-md">
          submit
        </button>
      </p>
    </Form>
  );
}
