# Application live on

https://bharat-cab-client.onrender.com/

# Bharat-cab

Blazing fast ride app. Movement is what we power. So when you think travel, think bharat-cab.

---

## Main business goals

-   Connect users/passengers with nearby drivers.
-   Real time tracking , Passenger can track ride on real time (through map).
-   Efficient booking by marking pickup location and drop-off location.
-   Management of drivers and users.

---

## functional requirements

#### customers

-   Customer should be able to pick source and destination of the ride
-   Customers should be able to get ETA and pricing information of ride .
-   Customers should be able to book a cab to a destination.
-   Customer should be able to cancel the ride
-   Customers should be able to see the location of the driver.

#### Drivers

-   Drivers should be able to accept or deny the customer requested ride.
-   Once a driver accepts the ride, they should see the pickup location of the customer.
-   Drivers should be able to mark the trip as complete on reaching the destination.

## Extended requirements

-   Customers can rate the trip after it’s completed.
-   Payment processing.

---

## Data model

![Bharat-cab-data-model](https://github.com/AkshayCdr/bharat-cab/blob/main/bharatCab_v3.png?raw=true)

---

## Bharat cab work flow

1. Customer set source and destination and request eta and price ride service register this request and return eta and price
2. Customer <ins> requests a ride </ins> by specifying the source, destination (payment method) etc.
3. Ride service register’s this request,<ins> finds nearby drivers </ins> , </ins>.
4. The request is then broadcast-ed to the nearby drivers for them to accept or deny.
5. If the driver accepts, the <ins> customer is notified about the live location of the driver</ins>.
6. The customer is picked up and the driver can start the trip.
7. Once the destination is reached, the driver will mark the ride as complete,
8. ***
9. (and collect payment.)
10. (After the payment is complete, the customer can leave a rating and feedback for the trip if they like.)

---

## Api contracts

### User

#### POST /user

`createUser` : creates new user

**Path params**

**Body params**

```
{
  username: string,
  password: string,
  name: string,
  email: string,
  phone: number
}
```

**Response**

-   New user created

**Response Code**

-   201 OK: created

---

#### GET /user/:id

`getUser` : get a specific user

**Path params**

-   id: {userID}

**Body params**

**Response**

```
{
  username: string,
  email: string,
  phone: number,
}
```

**Response Code**

-   200 OK:

---

### Session

#### POST /session

`userLogin` : authenticate user

**Path params**

**Body params**

```
{
  username: string,
  password: string,
}
```

**Response**

-   Session cookies

**Response Code**

-   200 OK:

---

#### DELETE /session

`userLogout` : logging out user

**Params**

-   Session cookies

**Response**

-   Session cookies removed

**Response Code**

-   204 NO CONTENT: session removed

---

### Driver

#### POST /driver

`createDriver` : creates new driver

**Path params**

**Body params**

```
{
  username: string,
  password: string,
  name: string,
  email: string,
  phone: number,
  cabType: string,
  cabRegNo: string,
}
```

**Response**

-   New driver created

**Response Code**

-   201 OK: created

---

#### GET /driver/:id

`getDriver` : get a specific driver

**Path params**

-   id: {driverID}

**Body params**

**Response**

```
{
  username: string,
  email: string,
  phone: number,
  cab{
    type: string,
    regNo: number,
  }
}
```

**Response Code**

-   200 OK:

---

#### PATCH /driver/:id

`goOnline` : driver go online

**Path params**

-   id :{driverID}

    **Body params**

```
{
  status:"online",
  location: location<object>
}
```

**Response**

-   Status updated

**Response Code**

-   200 OK: Driver status successfully updated

---

#### PATCH /driver/:id

`goOnline` : driver go offline

**Path params**

-   id :{driverID}

    **Body params**

```
{
  status:"offline",
  location: location<object>
}
```

**Response**

-   Status updated

**Response Code**

-   200 OK: Driver status successfully updated

---

### Rides

-   location object

```
{
  "location": {
    "latitude": number,
    "longitude": number
  },
}
```

#### POST /ride

`getRideDetails` : get ETA and price details of the ride

**Body params**

```
 source: location<Object>
 destination: location<Object>
```

**Response**

```
{
  id: uuid,
  price: string,
  ETA: string
}
```

**Response Code**

-   200 OK: ETA and price estimate successfully retrieved.

---

#### POST /ride/:id

`requestRide` : request a new ride

**Path params**

-   id: {user Id}

**Response**

-   Waiting for driver to connect

**Response Code**

-   200 OK: Searching for nearby driver .

---
