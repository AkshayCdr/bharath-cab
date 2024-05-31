# Bharat-cab 
Blazing fast ride app. Movement is what we power. So when you think travel, think bharat-cab.

---

## Main business goals

- Connect users/passengers with nearby drivers.
- Real time tracking , Passenger can track ride on real time (through map).
- Efficient booking by marking pickup location and drop-off location. 
- Management of drivers and users.

---

## functional requirements

#### customers
- Customers should be able to get ETA and pricing information of ride .
- Customers should be able to book a cab to a destination.
- Customers should be able to see the location of the driver.

#### Drivers

- Drivers should be able to accept or deny the customer requested ride.
- Once a driver accepts the ride, they should see the pickup location of the customer.
- Drivers should be able to mark the trip as complete on reaching the destination.

## Extended requirements

- Customers can rate the trip after it’s completed.
- Payment processing.

---

## Data model

![Bharat-cab-data-model](https://github.com/AkshayCdr/bharat-cab/blob/main/bharat-cab-model.png?raw=true)


---

## Bharat cab work flow

1. Customer <ins> requests a ride </ins> by specifying the  source, destination  (payment method) etc.
2. Ride service register’s this request,<ins> finds nearby drivers </ins> , and <ins> calculates the estimated time of arrival (ETA) </ins>.
3. The request is then broadcast-ed to the nearby drivers for them to accept or deny.
4. If the driver accepts, the <ins> customer is notified about the live location of the driver</ins>.
5. The customer is picked up and the driver can start the trip.
6. Once the destination is reached, the driver will mark the ride as complete and collect payment.
7. After the payment is complete, the customer can leave a rating and feedback for the trip if they like.







  
