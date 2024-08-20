import { Form } from "@remix-run/react";

export default function DriverSignUp() {
    return (
        <Form
            method="POST"
            className="max-w-md mx-auto flex flex-col bg-gray-950 gap-8 m-5 p-10 rounded-lg opacity-70 text-white"
        >
            <input
                type="text"
                name="name"
                id=""
                required
                placeholder="Name"
                className="h-10 bg-gray-950 border-b-2  focus:outline-none text-2xl hover:border-b-4  focus:border-yellow-300"
            />

            <input
                type="email"
                name="email"
                id=""
                placeholder="Email"
                className="h-10 bg-gray-950 border-b-2  focus:outline-none text-2xl hover:border-b-4  focus:border-yellow-300"
            />

            <input
                type="number"
                name="phone"
                minLength={10}
                maxLength={10}
                id=""
                required
                placeholder="Phone"
                className="h-10 bg-gray-950 border-b-2  focus:outline-none text-2xl hover:border-b-4  focus:border-yellow-300"
            />

            <input
                type="text"
                name="cabType"
                value="car"
                readOnly
                placeholder="Cab Type"
                className="h-10 bg-gray-950 border-b-2  focus:outline-none text-2xl hover:border-b-4  focus:border-yellow-300"
            />

            <input
                type="text"
                name="regNo"
                id=""
                pattern="[A-Za-z0-9]+"
                required
                placeholder="Cab Reg No."
                className="h-10 bg-gray-950 border-b-2  focus:outline-none text-2xl hover:border-b-4  focus:border-yellow-300"
            />

            <input
                type="text"
                name="username"
                minLength={3}
                id=""
                required
                placeholder="Username"
                className="h-10 bg-gray-950 border-b-2  focus:outline-none text-2xl hover:border-b-4  focus:border-yellow-300"
            />

            <input
                type="password"
                name="password"
                minLength={3}
                required
                placeholder="Password"
                className="h-10 bg-gray-950 border-b-2  focus:outline-none text-2xl hover:border-b-4  focus:border-yellow-300"
            />

            <button
                className="submit bg-blue-600 text-white py-2 px-5 rounded-md w-40 m-auto hover:bg-blue-800"
                name="intent"
                value="createDriver"
            >
                submit
            </button>
        </Form>
    );
}
