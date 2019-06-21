import fs from "fs";
import path from "path";
import { templatesFolder } from "./paths";

const folderNames = fs.readdirSync(templatesFolder);
const templateInfoList = folderNames.map(templateName => ({
  ...require(path.resolve(templatesFolder, templateName, "template.json")),
  templateName
}));

export function isValidTemplate(template: string) {
  const isValid = folderNames.includes(template);
  return isValid;
}

export function getTemplates() {
  return templateInfoList;
}
