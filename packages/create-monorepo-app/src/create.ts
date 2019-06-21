#!/usr/bin/env node
import inquirer from "inquirer";
import kebabCase from "lodash.kebabcase";
import chalk from "chalk";
import program from "commander";
import { appAlreadyExists } from "./paths";
import { copyTemplate } from "./copy-template";
import { getTemplates, isValidTemplate } from "./templates";
import fs from "fs";
import path from "path";
import rimraf from "rimraf";
import { promisify } from "util";
const clearConsole = require("react-dev-utils/clearConsole");
const pkgJson = require("../package.json");

const rmrf = promisify(rimraf);

async function cleanUp(appName: string) {
  try {
    const folder = path.resolve(process.cwd(), appName);
    const folderExists = fs.existsSync(folder);

    if (folderExists) {
      await rmrf(folder);
    }
  } catch (err) {
    console.error("Error while cleaning up");
    throw new Error(err);
    // do nothing
  }
}

async function createApplication(appName: string, templateName: string) {
  try {
    await copyTemplate(appName, templateName);
  } catch (err) {
    console.error("Error while creating application");
    throw new Error(err);
  }
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
    when: () => !appName,
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

  const templateChoices = getTemplates().map(template => ({
    name: template.name,
    value: template.templateName
  }));
  const templateNamePrompt = {
    type: "list",
    name: "template",
    message: "Template",
    when: () => !templateName,
    choices: templateChoices
  };

  const prompts = [appNamePrompt, templateNamePrompt];

  const { name, template } = await inquirer.prompt(prompts as any);

  if (name) appName = name;
  appName = kebabCase(appName);

  if (template) templateName = template;

  if (!isValidTemplate(templateName)) {
    console.log(`Template ${chalk.red(templateName)} is not a valid template`);
    console.log(`Please select a valid template from the list.`);
    const templatePromptWithoutWhen = { ...templateNamePrompt };
    delete templatePromptWithoutWhen.when;
    const validTemplateName = await inquirer.prompt(
      templatePromptWithoutWhen as any
    );
    templateName = (validTemplateName as { template: string }).template;
  }

  if (appAlreadyExists(appName)) {
    console.log(`Folder ${chalk.red(appName)} already exists`);
    const appNamePromptWithoutWhen = { ...appNamePrompt };
    delete appNamePromptWithoutWhen.when;
    const validAppName = await inquirer.prompt(appNamePromptWithoutWhen as any);
    appName = (validAppName as { name: string }).name;
  }

  console.log(
    `Creating new application ${chalk.greenBright(
      appName
    )} with template ${chalk.greenBright(
      templateChoices.find(t => t.value === templateName)!.name
    )}`
  );

  try {
    await createApplication(appName, templateName);
  } catch (err) {
    await cleanUp(appName);
    console.error(err);
  }
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
