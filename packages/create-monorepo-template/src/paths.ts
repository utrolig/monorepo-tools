import path from "path";
import fs from "fs";

const templateFolder = path.resolve(__dirname, "../template");
const cwd = process.cwd();

export function resolveAppFolder(appName: string) {
  return path.resolve(process.cwd(), appName);
}

export function appAlreadyExists(appName: string) {
  const applicationPath = path.resolve(process.cwd(), appName);
  const exists = fs.existsSync(applicationPath);
  return exists;
}

export const paths = {
  templateFolder,
  cwd
};
