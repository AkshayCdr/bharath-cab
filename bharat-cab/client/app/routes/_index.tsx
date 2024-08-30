import type {
    ActionFunctionArgs,
    LinksFunction,
    MetaFunction,
} from "@remix-run/node";

import styles from "../styles/index.css?url";

import { authLoader } from "~/utils/auth.server";
import InputPrice from "~/component/InputPrice";
import { ride } from "~/apis/ride.server";

export const meta: MetaFunction = () => {
    return [
        { title: "New Remix App" },
        { name: "description", content: "Welcome to Remix!" },
    ];
};

const getCoordinates = (name, formData) =>
    formData
        .get(name)
        ?.toString()
        .split(",")
        .map((ele) => parseFloat(ele))
        .reduce(
            (acc, ele, ind) =>
                ind === 0
                    ? { ...acc, latitude: ele }
                    : { ...acc, longitude: ele },
            {}
        );

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();

    if (!formData.get("source-coords") || !formData.get("destination-coords")) {
        return null;
    }

    const source = getCoordinates("source-coords", formData);

    const destination = getCoordinates("destination-coords", formData);

    if (!source || !destination) return null;

    const data = await ride.getDistance(source, destination);

    if (!data) return null;
    return data;
}

export default function Index() {
    return (
        <div>
            <div
                style={{
                    fontFamily: "system-ui, sans-serif",
                    lineHeight: "1.8",
                }}
            >
                <main className="bg-gray-950 flex flex-col lg:flex-row justify-between ">
                    <div className="text-white m-16 p-8">
                        <h1 className=" text-6xl font-bold max-w-sm">
                            Go anywhere with Bharat Cab
                        </h1>
                        <InputPrice />
                    </div>
                    <img
                        src="/main-bc.jpg"
                        alt="Getting ride"
                        className="m-10 p-10"
                    />
                </main>
            </div>
        </div>
    );
}

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];
