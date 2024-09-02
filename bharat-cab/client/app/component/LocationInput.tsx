import { Form, useActionData, useNavigation } from "@remix-run/react";

export default function LocationInput({
    userId,
    sourceName,
    destinationName,
    source,
    destination,
}) {
    const data = useActionData();

    const navigation = useNavigation();

    const isSubmitting = navigation.state !== "idle";

    return (
        <Form method="POST" id="location-form">
            <div className="text-black m-10">
                <input type="hidden" name="userId" value={userId} />
                <input type="text" name="source" id="" value={source} hidden />
                <input
                    type="text"
                    name="destination"
                    id=""
                    value={destination}
                    hidden
                />
                <div className="flex flex-col gap-3 p-5 ">
                    <input
                        type="text"
                        name="sourceName"
                        value={sourceName}
                        readOnly
                        className="h-12 rounded-lg text-left px-4"
                        placeholder="Enter pickup location"
                        required
                    />

                    <input
                        type="text"
                        name="destinationName"
                        id=""
                        value={destinationName}
                        readOnly
                        className="h-12 rounded-lg text-left px-4"
                        placeholder="Where to?"
                        required
                    />
                </div>
            </div>
            <div className="flex flex-col items-center">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-48 "
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "submitting...." : "submit"}
                </button>
            </div>
            {data && <span className="text-red-600"> {data.message}</span>}
        </Form>
    );
}
