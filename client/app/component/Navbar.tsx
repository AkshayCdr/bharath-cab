import { NavLink } from "@remix-run/react";

export default function Navbar() {
  return (
    <nav className="nav h-16 bg-black text-white p-10 items-center">
      <ul className="flex flex-row items-center text-lg justify-between">
        <div>
          <li className="text-3xl">
            <NavLink to={`/`}>Bharat Cab</NavLink>
          </li>
        </div>
        <div>
          <li>
            <NavLink to={`/login`}>login</NavLink>
          </li>
        </div>
      </ul>
    </nav>
  );
}
