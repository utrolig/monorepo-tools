import { ncp as ncpCb } from "ncp";
import { promisify } from "util";
import path from "path";
import chalk from "chalk";
import {
  commonTemplateJsonPath,
  templatesFolder,
  commonTemplateFolder
} from "./paths";
import fs from "fs";

const commonTemplateJson = require(commonTemplateJsonPath);

const ncp = promisify(ncpCb);

export function copyCommonTemplate(destination: string) {
  const filesToCopy = fs
    .readdirSync(commonTemplateFolder)
    .filter(fileName => fileName !== "template.json");

  for (const fileToCopy of filesToCopy) {
    fs.copyFileSync(
      path.resolve(commonTemplateFolder, fileToCopy),
      path.resolve(destination)
    );
  }
}

export function createDirectory(folderPath: string) {
  fs.mkdirSync(folderPath);
}

export function createPkgJsonAndReturnDependenciesToInstall(
  name: string,
  template: string,
  destinationFolder: string
) {
  const pathToTemplateJson = path.resolve(
    templatesFolder,
    template,
    "template.json"
  );
  const templateJson = require(pathToTemplateJson);
  const packageJsonForApp = {
    name,
    private: true,
    version: "0.0.1",
    scripts: templateJson.scripts
  };
  const depsToInstall = [
    ...commonTemplateJson.dependencies,
    ...templateJson.dependencies
  ];
  const devDepsToInstall = [
    ...commonTemplateJson.devDependencies,
    ...templateJson.devDependencies
  ];

  const destinationFile = path.resolve(destinationFolder, "package.json");

  fs.writeFileSync(destinationFile, JSON.stringify(packageJsonForApp, null, 2));

  return { depsToInstall, devDepsToInstall };
}

export async function copyTemplate(name: string, template: string) {
  try {
    const destinationFolder = path.resolve(process.cwd(), name);
    createDirectory(destinationFolder);

    console.log(`Creating ${chalk.green("package.json")}...`);
    createPkgJsonAndReturnDependenciesToInstall(
      name,
      template,
      destinationFolder
    );
    copyCommonTemplate(destinationFolder);
    console.log("Copying template to", chalk.green(destinationFolder));
    console.log("Done copying.");
  } catch (err) {
    console.error("Something went wrong while copying the template.");
    throw new Error(err);
  }
}
