import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";

import styles from "./styles/main.css?url";
import { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";

import stylesheet from "~/tailwind.css?url";
import Navbar from "./component/Navbar";

const parseAccountId = (input) =>
  input
    .split(";")
    .map((ele) => ele.split("="))
    .filter((ele) => ele[0].trim() === "accountId")
    .flat()[1];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieString = request.headers.get("cookie");

  const accountId = parseAccountId(cookieString);
  console.log(accountId);
  return null;
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Navbar />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { rel: "stylesheet", href: stylesheet },
];

export default function App() {
  return <Outlet />;
}

// export function ErrorBoundary() {
//   const error = useRouteError();

//   if (isRouteErrorResponse(error)) {
//     return (
//       <div>
//         <h1>
//           {error.status} {error.statusText}
//         </h1>
//         <p>{error.data}</p>
//       </div>
//     );
//   } else if (error instanceof Error) {
//     return (
//       <div>
//         <h1>Error</h1>
//         <p>{error.message}</p>
//         <p>The stack trace is:</p>
//         <pre>{error.stack}</pre>
//       </div>
//     );
//   } else {
//     return <h1>Unknown Error</h1>;
//   }
// }
