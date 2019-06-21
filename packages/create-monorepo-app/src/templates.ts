import fs from "fs";
import { templatesFolder } from "./paths";

export function getTemplates() {
  const folderNames = fs.readdirSync(templatesFolder);
  console.log(folderNames);
  return [];
}
