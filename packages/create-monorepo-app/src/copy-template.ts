import { ncp as ncpCb } from "ncp";
import { promisify } from "util";
import chalk from "chalk";
import { commonTemplateJsonPath } from "./paths";

const commonTemplateJson = require(commonTemplateJsonPath);

const ncp = promisify(ncpCb);

export async function copyCommonTemplate(destination: string) {}

export async function copyTemplate(destination: string, template: string) {
  try {
    console.log(commonTemplateJson);
    console.log("Copying template to", chalk.green(destination));
    console.log("Done copying.");
    return;
  } catch (err) {
    console.error(err);
  }
}
