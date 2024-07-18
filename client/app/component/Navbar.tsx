import { NavLink } from "@remix-run/react";

export default function Navbar({ accountId }) {
  return (
    <nav className="nav h-16 bg-black text-white p-10 items-center justify-center">
      <ul className="flex flex-row items-center text-lg justify-between ">
        <div className="">
          <li className="text-3xl">
            <NavLink to={`/`}>Bharat Cab</NavLink>
          </li>
        </div>

        {accountId ? (
          <NavLink to="/logout">Logout</NavLink>
        ) : (
          <NavLink to="/login">Login</NavLink>
        )}
      </ul>
    </nav>
  );
}
