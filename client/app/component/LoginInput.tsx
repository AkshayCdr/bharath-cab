// import React from 'react'
import { Form } from "@remix-run/react";

export default function LoginInput() {
  return (
    <Form
      method="POST"
      id="login-form"
      className="flex flex-col min-h-full flex-1 border p-8 m-5 bg-black opacity-90 text-white items-center justify-center rounded-md mx-auto "
    >
      <p className="flex flex-col gap-3  sm:w-full sm:max-w-md ">
        <input
          className="m-5 p-2 rounded-md border"
          type="text"
          name="username"
          placeholder="username"
          required
          minLength={2}
          maxLength={30}
        />
        <input
          className="m-4 p-2 rounded-md border"
          type="password"
          name="password"
          placeholder="password"
          required
          minLength={2}
          maxLength={30}
        />
        <span className="user-driver">
          <span>user</span>
          <input type="checkbox" name="user" value="check" />
          <span>driver</span>
          <input type="checkbox" name="driver" value="check" />
        </span>
      </p>
      <p className="login-button">
        <button className="submit bg-blue-600 text-white py-2 px-5 rounded-md">
          submit
        </button>
      </p>
    </Form>
  );
}
