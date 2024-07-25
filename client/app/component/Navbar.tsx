import { NavLink, useLoaderData } from "@remix-run/react";
import { useAuth } from "~/context/authContext";
import { loader } from "~/root";

export default function Navbar() {
  const { state } = useAuth();

  const { userId } = useLoaderData<typeof loader>();
  return (
    <nav className="nav h-16 bg-black text-white p-10 items-center justify-center">
      <ul className="flex flex-row items-center text-lg justify-between ">
        <div className="">
          <li className="text-3xl">
            <NavLink to={`/`}>Bharat Cab</NavLink>
          </li>
        </div>

        {userId ? (
          <form action="/logout" method="post">
            <button>Logout</button>
          </form>
        ) : (
          <NavLink to="/login">Login</NavLink>
        )}

        {state?.accountName && <p>{state.accountName}</p>}
      </ul>
    </nav>
  );
}
