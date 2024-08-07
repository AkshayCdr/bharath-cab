import { aW } from "vitest/dist/reporters-BU_vXAUX";
import { getDriverId, getLocation } from "../model/ride.model";
import { rideServices } from "../services/ride.services";
import { test, assert } from "vitest";

// test("update status using given ID", async () => {
//     const id = "140e2103-e4f9-4a1f-8611-1a9462bf046a";
//     const status = "driver_accepted";
//     // await rideServices.updateStatus(id, status);
//     await rideServices.updateStatus(id, "cancelled");
// });

// test("get status using given id", async () => {
//     const id = "140e2103-e4f9-4a1f-8611-1a9462bf046a";
//     const data = await rideServices.getStatus(id);
//     console.log(data);
// });

// test("get distance for given source and destianation", async () => {
//     const id = "4279b07d-ea46-418b-b525-e3ce7b65e700";
//     const source = {
//         longitude: 77.56197398834188,
//         latitude: 12.942664343103248,
//     };
//     const destination = {
//         longitude: 77.61327799123202,
//         latitude: 12.919910469324924,
//     };
//     await rideServices.update({ id, source, destination });
// });

// test("check ride and user", async () => {
//     const id = "5504665b-54b6-4292-92f3-243590b683f8";
//     const data = await rideServices.getRideAndUser(id);
//     console.log(data);
// });

// test("get location ", async () => {
//     const rideId = "0632dc4b-0c35-4e38-9057-122ccdb173df";
//     const { source, destination } = await getLocation(rideId);
//     console.log(source);
//     console.log(destination);
// });

// test('testing location data'async() =>{
//     const rideId = '0155b2a2-915c-49a4-a9d2-c212a24cf138'
//     const
// (77.57318609587904,12.948540850865397)
// (77.62023665368513,12.919436561781483)
// })

test("getting distance from api", async () => {
    const source = {
        x: 12.948540850865397,
        y: 77.57318609587904,
    };
    const destination = {
        x: 12.919436561781483,
        y: 77.62023665368513,
    };

    const distance = await rideServices.getDistance(source, destination);

    console.log(distance);
});

test("getting driver id from ride ID", async () => {
    const rideId = "0632dc4b-0c35-4e38-9057-122ccdb173df";
    const id = await getDriverId(rideId);
    console.log(id);
});
