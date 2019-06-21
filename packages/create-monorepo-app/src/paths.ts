import path from "path";
import fs from "fs";

export function appAlreadyExists(appName: string) {
  const applicationPath = path.resolve(process.cwd(), appName);
  const exists = fs.existsSync(applicationPath);
  return exists;
}

export function resolveAppFolder(appName: string) {
  return path.resolve(process.cwd(), appName);
}

export const templatesFolder = path.resolve(__dirname, "../templates");
export const commonTemplateFolder = path.resolve(
  __dirname,
  "../template-common"
);
export const commonTemplateJsonPath = path.resolve(
  commonTemplateFolder,
  "template.json"
);
