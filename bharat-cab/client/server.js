import { createRequestHandler } from "@remix-run/express";
import express from "express";

// notice that the result of `remix vite:build` is "just a module"
import * as build from "./build/server/index.js";

const app = express();
app.use(express.static("build/client"));

app.all("*", createRequestHandler({ build }));

app.listen(5000, () => {
    console.log("App listening on http://localhost:5000");
});
