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
import spawn from "cross-spawn";

const commonTemplateJson = require(commonTemplateJsonPath);

const ncp = promisify(ncpCb);

export function runCommand(command: string, args: string[], cwd: string) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit", cwd });
    child.on("close", code => {
      if (code !== 0) {
        reject({
          command: `${command} ${args.join(" ")}`
        });
        return;
      }
      resolve();
    });
  });
}

export async function installDeps(
  dependencies: {
    depsToInstall: string[];
    devDepsToInstall: string[];
  },
  destinationFolder: string
) {
  const cmd = "yarnpkg";
  const args = ["add", ...dependencies.depsToInstall];
  await runCommand(cmd, args, destinationFolder);

  const devArgs = ["add", "--dev", ...dependencies.devDepsToInstall];
  await runCommand(cmd, devArgs, destinationFolder);
}

export function copyCommonTemplate(destination: string) {
  const filesToCopy = fs
    .readdirSync(commonTemplateFolder)
    .filter(fileName => fileName !== "template.json");

  for (const fileToCopy of filesToCopy) {
    fs.copyFileSync(
      path.resolve(commonTemplateFolder, fileToCopy),
      path.resolve(destination, fileToCopy)
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

export async function copyApplicationTemplate(
  destinationFolder: string,
  template: string
) {
  const templateFilesPath = path.resolve(templatesFolder, template, "files");
  console.log("templateFilesPath", templateFilesPath);
  console.log("destinationFolder", destinationFolder);
  await ncp(templateFilesPath, destinationFolder);
}

export async function copyTemplate(
  name: string,
  template: string,
  folder: string = ""
) {
  try {
    const destinationFolder = path.resolve(process.cwd(), folder, name);
    createDirectory(destinationFolder);

    console.log(`Creating ${chalk.green("package.json")}...`);
    const deps = createPkgJsonAndReturnDependenciesToInstall(
      name,
      template,
      destinationFolder
    );
    console.log("Copying template to", chalk.green(destinationFolder));
    copyCommonTemplate(destinationFolder);
    copyApplicationTemplate(destinationFolder, template);
    console.log("Done copying.");
    console.log("Installing dependencies");
    await installDeps(deps, destinationFolder);
  } catch (err) {
    console.error("Something went wrong while copying the template.");
    throw new Error(err);
  }
}
