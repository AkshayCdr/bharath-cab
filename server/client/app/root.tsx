import {
    isRouteErrorResponse,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useRouteError,
} from "@remix-run/react";

import styles from "./styles/main.css?url";
import { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";

import stylesheet from "~/tailwind.css?url";
import Navbar from "./component/Navbar";
import { AuthProvider } from "./context/authContext";

import { account } from "./apis/account.server";
import ErrorRoot from "./component/ErrorRoot";

export async function loader({ request }: LoaderFunctionArgs) {
    const response = await account.getAccountId(request.headers.get("Cookie"));
    if (!response.ok) return null;

    const userId = response?.accountId;

    if (userId) return userId;
    return null;
}

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <Meta />
                <Links />
            </head>
            <body>
                <AuthProvider>
                    <Navbar />
                    {children}
                    <ScrollRestoration />
                    <Scripts />
                </AuthProvider>
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

export function ErrorBoundary() {
    const error = useRouteError();

    if (isRouteErrorResponse(error)) {
        return (
            <div>
                <h1>
                    {error.status} {error.statusText}
                </h1>
                <p>{error.data}</p>
            </div>
        );
    } else if (error instanceof Error) {
        return <ErrorRoot message={error.message} stack={error.stack} />;
    } else {
        return <h1>Unknown Error</h1>;
    }
}
