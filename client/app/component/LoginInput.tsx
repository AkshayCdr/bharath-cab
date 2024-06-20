// import React from 'react'
import { Form } from "@remix-run/react";

export default function LoginInput() {
  return (
    <Form method="POST" id="login-form">
      <p className="login-details">
        <input type="text" name="username" id="" placeholder="username" />
        <input type="password" name="password" id="" placeholder="password" />
        <p className="user-driver">
          <span>user</span>
          <input type="checkbox" name="user" id="" value="check" />
          <span>driver</span>
          <input type="checkbox" name="driver" id="" value="check" />
        </p>
      </p>
      <p className="login-button">
        <button className="submit">submit</button>
      </p>
    </Form>
  );
}
