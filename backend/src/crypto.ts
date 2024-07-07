import { compare as b_compare, hash as b_hash } from "bcrypt";

export function hash(password: string) {
  return b_hash(password, 10);
}

export function compare(password: string, hash: string) {
  return b_compare(password, hash);
}
