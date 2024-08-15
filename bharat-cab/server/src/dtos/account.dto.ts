export interface Account {
  readonly _id?: string;
  accountType?: string;
  username?: string;
  password: string;
}

// enum accountType {
//   USER = "user",
//   Driver = "driver",
// }
