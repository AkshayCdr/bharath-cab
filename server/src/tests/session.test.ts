import { expect, test } from "vitest";
import { account } from "../services/account.services";
import { getAccountTypeTable, isSessionExist } from "../model/session.model";

test("get account type using given id", async () => {
    const id = "50e441cb-daa5-4df1-a74a-406cae679af2";

    const type = await account.type(id);

    expect(type).toBe("user");
});

test("check session exist or not", async () => {
    const sessionID = "92f45646-6534-45bd-959e-88d5bc795a0f";
    const isSession = await isSessionExist(sessionID);
    expect(isSession).toBe(true);
});

test("get accountType from session table", async () => {
    const sessionId = "005db0ec-62fb-481d-ae18-6ae386133ed4";
    const result = await getAccountTypeTable(sessionId);
    console.log(result);
});
