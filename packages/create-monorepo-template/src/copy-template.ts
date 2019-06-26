import { ncp as ncpCb } from "ncp";
import { promisify } from "util";
import { paths } from "./paths";
import chalk from "chalk";
import fs from "fs";
import path from "path";

const ncp = promisify(ncpCb);

export async function copyTemplate(destination: string) {
  try {
    console.log("Copying template to", chalk.green(destination));
    await ncp(paths.templateFolder, destination);

    const newFolderPath = path.resolve(destination, "packages");
    fs.mkdirSync(newFolderPath);

    console.log("Done copying.");
  } catch (err) {
    console.error(err);
  }
}
