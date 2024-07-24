import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { useAuth } from "~/context/authContext";
import { loader } from "~/routes/driver/driver";

export default function useDriver() {
  const { driverData } = useLoaderData<typeof loader>();
  // const { dispatch } = useAuth();

  // dispatch({
  //   type: "account/login",
  //   payload: { accountId: "", accountName: "" },
  // });

  const [userDetails, setUserDetails] = useState({});
  const [online, setOnline] = useState(false);
  const [isRideAccepted, setRideAccepted] = useState(false);

  const toggleOnline = () => {
    setOnline(!online);
  };
  return {
    driverData,
    userDetails,
    setUserDetails,
    online,
    toggleOnline,
    isRideAccepted,
    setRideAccepted,
  };
}
