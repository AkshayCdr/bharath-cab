import { Link } from "@remix-run/react";

export default function Login() {
  return (
    <div>
      <Link to={`/user`}>user</Link>
      <Link to={`/driver`}>driver</Link>
    </div>
  );
}
