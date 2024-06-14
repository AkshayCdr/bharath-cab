import { socket } from "~/socket/websocket";
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";

import { Form, useLoaderData, useNavigate } from "@remix-run/react";

export const loader = ({ params }: LoaderFunctionArgs) => {
  console.log(params.id);
  return json({ params });
};

export default function Driver() {
  const { params } = useLoaderData<typeof loader>();

  function goOnline() {
    socket.on("registerDriver", params.id);
  }
  socket.on("connect", () => {
    console.log(socket.id);
  });
  return (
    <div>
      <button onClick={goOnline}>goOnline</button>
      Driver
    </div>
  );
}
