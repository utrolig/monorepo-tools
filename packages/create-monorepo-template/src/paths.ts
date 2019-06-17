import path from "path";
import fs from "fs";

const templateFolder = path.resolve(__dirname, "../template");
const cwd = process.cwd();

export function resolveAppFolder(appName: string) {
  return path.resolve(process.cwd(), appName);
}

export function appAlreadyExists(appName: string) {
  const exists = fs.existsSync(path.resolve(process.cwd(), appName));
  return exists;
}

export const paths = {
  templateFolder,
  cwd
};
