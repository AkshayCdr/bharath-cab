import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

import styles from "../styles/index.css?url";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <main className="main-page">
        <h1 className="main-heading">Bharat Cab</h1>
      </main>
    </div>
  );
}

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];
