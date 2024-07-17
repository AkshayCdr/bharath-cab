import type { LinksFunction, MetaFunction } from "@remix-run/node";

import styles from "../styles/index.css?url";
import Navbar from "~/component/Navbar";

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
        <main className="main-page">
          <h1 className="main-heading">Bharat Cab</h1>
        </main>
      </div>
    </div>
  );
}

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];
