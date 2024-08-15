import { addSession, deleteSessionFromTable } from "../model/session.model";

async function add(accountId: string): Promise<string> {
  return addSession(accountId);
}

async function deleteSession(sessionId: string) {
  return deleteSessionFromTable(sessionId);
}

export const session = {
  add,
  deleteSession,
};
