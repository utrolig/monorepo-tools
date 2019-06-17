#!/usr/bin/env node
import chalk from "chalk";
import path from "path";
import { copyTemplate } from "./copy-template";
import kebabCase from "lodash.kebabcase";
import { writeFileSync } from "fs";
import inquirer from "inquirer";
import { appAlreadyExists, resolveAppFolder } from "./paths";
const clearConsole = require("react-dev-utils/clearConsole");

clearConsole();

const [_firstArg, __secondArg, folderName] = process.argv;

if (!folderName) {
  inquirer
    .prompt({
      type: "input",
      name: "name",
      message: "Name your monorepo",
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
    .then((answers: any) => answers["name"])
    .then(resolveAppFolder)
    .then(createMonorepo);
} else {
  const destinationFolder = path.resolve(process.cwd(), kebabCase(folderName));
  createMonorepo(destinationFolder);
}

async function createMonorepo(destFolder: string) {
  console.log("Creating new monorepo at", chalk.green(destFolder));
  await copyTemplate(destFolder);
  const pathToPkgJson = path.resolve(destFolder, "package.json");
  const pkgJson = require(pathToPkgJson);
  pkgJson.name = kebabCase(folderName);
  writeFileSync(pathToPkgJson, JSON.stringify(pkgJson, null, 2));
}
