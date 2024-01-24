import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { pbkdf2Sync } from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const salt = "fvjreshvdujknedik";
export function hash(team_name: string) {
  return pbkdf2Sync(team_name, salt, 1000, 64, "sha512").toString("hex");
}
