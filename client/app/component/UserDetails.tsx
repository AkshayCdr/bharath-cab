/* eslint-disable @typescript-eslint/ban-ts-comment */

import { User } from "~/routes/user.$userId";

// interface UserDetails {
//   userData: User;
// }

export default function UserDetails({ userData }) {
  console.log({ userData });

  return (
    <div>
      <h1>UserData</h1>
      <h1>{userData.name}</h1>
      <h2>{userData.phone}</h2>
      {/* <p>{userData.source.x}</p>
      <p>{userData.source.y}</p>
      <p>{userData.destination.x}</p>
      <p>{userData.destination.y}</p> */}
    </div>
  );
}
