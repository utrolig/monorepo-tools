import { ncp as ncpCb } from "ncp";
import { promisify } from "util";
import { paths } from "./paths";
import chalk from "chalk";

const ncp = promisify(ncpCb);

export async function copyTemplate(destination: string) {
  try {
    console.log("Copying template to", chalk.green(destination));
    await ncp(paths.templateFolder, destination);
    console.log("Done copying.");
  } catch (err) {
    console.error(err);
  }
}
