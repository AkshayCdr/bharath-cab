// import React from 'react'
import { Form } from "@remix-run/react";

export default function Login() {
  return (
    <Form>
      <input type="text" name="username" id="" placeholder="username" />
      <input type="password" name="password" id="" placeholder="password" />
    </Form>
  );
}
