import { User } from "../dtos/user.dto";

import { createUser } from "../model/user.model";

export async function create(user: User): Promise<string> {
  return createUser(user);
}

export const user = {
  create,
};
