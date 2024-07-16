import { addSession } from "../model/session.model";

async function add(accountId: string): Promise<string> {
  return addSession(accountId);
}

export const session = {
  add,
};
