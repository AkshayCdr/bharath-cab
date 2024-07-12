import { expect, test } from "vitest";
import { account } from "../services/account.services";

test("get account type using given id", async () => {
  const id = "50e441cb-daa5-4df1-a74a-406cae679af2";

  const type = await account.type(id);

  expect(type).toBe("user");
});
