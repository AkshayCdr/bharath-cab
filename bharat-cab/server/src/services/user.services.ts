import { User } from "../dtos/user.dto";

import { createUser, getUser } from "../model/user.model";

export async function create(user: User): Promise<string> {
  return createUser(user);
}

export async function get(id: string): Promise<User> {
  return getUser(id);
}

export const user = {
  create,
  get,
};
