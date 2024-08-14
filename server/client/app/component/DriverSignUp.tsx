import { Form } from "@remix-run/react";

export default function DriverSignUp() {
    return (
        <Form>
            <label htmlFor="name">Name</label>
            <input type="text" name="name" id="" required />

            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="" />

            <label htmlFor="phone">Phone</label>
            <input
                type="number"
                name="phone"
                minLength={10}
                maxLength={10}
                id=""
                required
            />

            <label htmlFor="cabType">Cab type</label>
            <input type="text" name="cabType" value="car" readOnly />

            <label htmlFor="regNumber">Reg No.</label>
            <input type="text" name="regNo" id="" required />

            <label htmlFor="username">username</label>
            <input type="text" name="username" minLength={3} id="" required />

            <label htmlFor="password">password</label>
            <input type="password" name="password" minLength={3} required />

            <button className="">submit</button>
        </Form>
    );
}
