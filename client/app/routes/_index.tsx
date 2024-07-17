import type { LinksFunction, MetaFunction } from "@remix-run/node";

import styles from "../styles/index.css?url";
import Navbar from "~/component/Navbar";
import InputPrice from "~/component/InputPrice";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div>
      <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
        <main className="bg-black h-[80vh] flex justify-between">
          <div className="text-white m-16 p-8">
            <h1 className=" text-6xl font-bold">Go anywhere with Bharat Cab</h1>
            <InputPrice />
          </div>
          <img
            src="/public/main-bc.jpg"
            alt="Getting ride"
            className="m-10 p-4 mr-44"
          />
        </main>
      </div>
    </div>
  );
}

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];
