import { Account } from "../dtos/account.dto";
import { createAccount } from "../model/account.model";

export async function create(account: Account): Promise<string> {
  return createAccount(account);
}

export async function insert(account: Account) {}

export const account = {
  create,
  insert,
};
