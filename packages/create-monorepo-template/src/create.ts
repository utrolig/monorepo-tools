#!/usr/bin/env node
import chalk from "chalk";
import path from "path";
import { copyTemplate } from "./copy-template";
import kebabCase from "lodash.kebabcase";
import { writeFileSync } from "fs";
import inquirer from "inquirer";
import { appAlreadyExists, resolveAppFolder } from "./paths";
import { installDependencies } from "./install";
import { cleanUp } from "./cleanup";
const clearConsole = require("react-dev-utils/clearConsole");

clearConsole();

let [_firstArg, __secondArg, folderName] = process.argv;

const startInquirer = () =>
  inquirer
    .prompt({
      type: "input",
      name: "name",
      message: "Name",
      filter: input => kebabCase(input),
      validate: input => {
        if (!input) {
          return "App name is required.";
        }
        if (appAlreadyExists(input)) {
          return `An application with name ${chalk.red(
            kebabCase(input)
          )} already exists. Please choose another one.`;
        }

        return true;
      }
    })
    .then((answers: any) => {
      const name = answers["name"];
      folderName = name;
      return name;
    })
    .then(resolveAppFolder)
    .then(createMonorepo);

if (!folderName) {
  startInquirer();
} else {
  const appName = kebabCase(folderName);
  if (appAlreadyExists(appName)) {
    console.log(
      `An application with name ${chalk.red(
        kebabCase(appName)
      )} already exists. Please choose another one.`
    );
    startInquirer();
  } else {
    const destinationFolder = path.resolve(process.cwd(), appName);
    createMonorepo(destinationFolder);
  }
}

async function createMonorepo(destFolder: string) {
  try {
    console.log("Creating new monorepo at", chalk.green(destFolder));
    await copyTemplate(destFolder);
    const pathToPkgJson = path.resolve(destFolder, "package.json");
    const pkgJson = require(pathToPkgJson);
    pkgJson.scripts = {
      new: "create-monorepo-app -f packages"
    };
    pkgJson.name = kebabCase(folderName);
    writeFileSync(pathToPkgJson, JSON.stringify(pkgJson, null, 2));
    installDependencies(destFolder);
  } catch (err) {
    console.log("Error while creating monorepo. Cleaning up...");
    await cleanUp(destFolder);
    console.error(err);
  }
}
