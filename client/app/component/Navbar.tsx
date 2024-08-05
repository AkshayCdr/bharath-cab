import { NavLink, useLoaderData } from "@remix-run/react";
import { useAuth } from "~/context/authContext";
import { loader } from "~/root";

export default function Navbar() {
  const { state } = useAuth();

  const userId = useLoaderData<typeof loader>();
  return (
    <nav className="nav h-16 bg-gray-950 text-white p-10 items-center justify-center">
      <ul className="flex flex-row items-center text-lg justify-between ">
        <li className="text-3xl">
          <NavLink to={`/`}>Bharat Cab</NavLink>
        </li>

        {userId ? (
          <div className="flex flex-row gap-5">
            <form action="/logout" method="post">
              <button>Logout</button>
            </form>
            {state?.accountName && <p>{state.accountName}</p>}
          </div>
        ) : (
          <NavLink to="/login">Login</NavLink>
        )}
      </ul>
    </nav>
  );
}
