import { User } from "../dtos/user.dto";
import {
  checkAccountExist,
  getPasswordFromTable,
} from "../model/account.model";
import { createUser } from "../model/user.model";

export async function checkUsername(username: string): Promise<boolean> {
  return checkAccountExist(username);
}

export async function getPassword(username: string): Promise<string> {
  return getPasswordFromTable(username);
}

export async function create(user: User): Promise<string> {
  return createUser(user);
}

export const user = {
  create,
  checkUsername,
  getPassword,
};
