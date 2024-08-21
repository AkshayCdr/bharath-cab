import { createRequestHandler } from "@remix-run/express";
import express from "express";
import https from "node:https";
import { createCA, createCert } from "mkcert";
import * as build from "./build/server/index.js";
// import cors from "cors";

const ca = await createCA({
    organization: "Hello CA",
    countryCode: "NP",
    state: "Bagmati",
    locality: "Kathmandu",
    validity: 365,
});

const cert = await createCert({
    ca: { key: ca.key, cert: ca.cert },
    domains: ["127.0.0.1", "localhost"],
    validity: 365,
});

const app = express();
// app.use(cors());
app.use(express.static("build/client"));

app.all("*", createRequestHandler({ build }));

// app.listen(5000, () => {
//     console.log("App listening on http://localhost:5000");
// });

const server = https.createServer(
    {
        key: cert.key,
        cert: cert.cert,
    },
    app
);

server.listen(5000, "192.168.1.108", () => {
    console.log("listening on port 5000");
});
