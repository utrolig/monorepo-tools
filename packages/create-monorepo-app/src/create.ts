#!/usr/bin/env node
import inquirer from "inquirer";
import kebabCase from "lodash.kebabcase";
import chalk from "chalk";
import program from "commander";
import { appAlreadyExists, resolveAppFolder } from "./paths";
import { copyTemplate } from "./copy-template";
import path from "path";
import { getTemplates } from "./templates";
const clearConsole = require("react-dev-utils/clearConsole");
const pkgJson = require("../package.json");

async function createApplication(appName: string) {
  const destinationFolder = path.resolve(process.cwd(), appName);
  await copyTemplate(destinationFolder, "typescript");
  // console.log("Creating new monorepo at", chalk.green(destFolder));
  // await copyTemplate(destFolder);
  // const pathToPkgJson = path.resolve(destFolder, "package.json");
  // const pkgJson = require(pathToPkgJson);
  // pkgJson.name = kebabCase(folderName);
  // writeFileSync(pathToPkgJson, JSON.stringify(pkgJson, null, 2));
}

const start = async (appName: string, templateName: string) => {
  const appNamePrompt = {
    type: "input",
    name: "name",
    message: "Name",
    filter: (input: string) => kebabCase(input),
    validate: (input: string) => {
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
  };

  const templateNamePrompt = {
    type: "expand",
    name: "templateName",
    message: "Template",
    choices: getTemplates().map(template => template)
  };

  const prompts = [];
  const formattedAppName = kebabCase(appName);

  if (!appName) {
    prompts.push(appNamePrompt);
  } else if (appAlreadyExists(formattedAppName)) {
    console.log(
      `An application with name ${chalk.red(
        formattedAppName
      )} already exists. Please choose another one.`
    );
    prompts.push(appNamePrompt);
  }

  const { name, template } = await inquirer.prompt(prompts as any);
  const appFolder = resolveAppFolder(name);
};

(async () => {
  program
    .version(pkgJson.version)
    .option("-a, --app [app]", "App Name")
    .option("-t, --template [template]", "Template")
    .parse(process.argv);

  clearConsole();
  const { app, template } = program;

  await start(app, template);
})();
