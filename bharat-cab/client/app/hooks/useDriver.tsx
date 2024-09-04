import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";

import { useAuth } from "~/context/authContext";
import { loader } from "~/routes/driver/driver";

export default function useDriver() {
    const { driverData } = useLoaderData<typeof loader>();
    const { dispatch } = useAuth();

    useEffect(() => {
        localStorage.setItem("auth", driverData.account_id);

        dispatch({
            type: "account/login",
            payload: {
                accountId: driverData.account_id,
                accountName: driverData.name,
            },
        });
    }, [dispatch, driverData.account_id, driverData.name]);

    const [userDetails, setUserDetails] = useState(null);

    return {
        driverData,
        userDetails,
        setUserDetails,
    };
}
